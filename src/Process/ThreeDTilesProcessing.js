import Fetcher from '../Core/Commander/Providers/Fetcher';
import { ThreeDTilesIndex } from '../Core/Commander/Providers/ThreeDTiles_Provider';

function requestNewTile(scheduler, geometryLayer, metadata, parent) {
    const command = {
        /* mandatory */
        requester: parent,
        layer: geometryLayer,
        priority: 10000,
        /* specific params */
        metadata,
        redraw: false,
    };

    return scheduler.execute(command);
}

function subdivideNode(context, layer, node) {
    if (!node.pendingSubdivision2 && node.children.filter(n => n.layer == layer.id).length == 0) {
        node.pendingSubdivision2 = true;

        const childrenTiles = layer.tileIndex.index[node.tileId].children;
        if (childrenTiles === undefined) {
            return;
        }

        const promises = [];
        for (let i = 0; i < childrenTiles.length; i++) {
            promises.push(
                requestNewTile(context.scheduler, layer, childrenTiles[i], node).then(() => {
                    if (node.additiveRefinement) {
                        context.scene.notifyChange(0, true);
                    }
                }));
        }

        Promise.all(promises).then(() => {
            node.pendingSubdivision2 = false;
            context.scene.notifyChange(0, true);
        });
    }
}

export function threeDTilesCulling(node, camera) {
    if (node.boundingVolume.region) {
        // TODO
    } else if (node.boundingVolume.box) {
        return !camera.getFrustum().intersectsBox(node.boundingVolume.box);
    } else if (node.boundingVolume.sphere) {
        return !camera.getFrustum().intersectsSphere(node.boundingVolume.sphere);
    }
    return false;
}

let preSSE;
export function pre3DTilesUpdate(context) {
    // pre-sse
    const hypotenuse = Math.sqrt(context.camera.width * context.camera.width + context.camera.height * context.camera.height);
    const radAngle = context.camera.FOV * Math.PI / 180;

     // TODO: not correct -> see new preSSE
    // const HFOV = 2.0 * Math.atan(Math.tan(radAngle * 0.5) / context.camera.ratio);
    const HYFOV = 2.0 * Math.atan(Math.tan(radAngle * 0.5) * hypotenuse / context.camera.width);
    preSSE = hypotenuse * (2.0 * Math.tan(HYFOV * 0.5));
}

function computeNodeSSE(camera, node) {
    if (node.boundingVolume.region) {
        // TODO
    } else if (node.boundingVolume.box) {
        // TODO: compute proper distance
        const distance = camera.camera3D.position.distanceTo(node.boundingVolume.box.getCenter());
        return preSSE * (node.geometricError / distance);
    } else if (node.boundingVolume.sphere) {
        const distance = Math.max(
            0.0,
            camera.camera3D.position.distanceTo(node.boundingVolume.sphere.center) - node.boundingVolume.sphere.radius);
        return preSSE * (node.geometricError / distance);
    }
    return Infinity;
}

export function init3DTilesLayer(context, layer) {
    if (layer.initialised) {
        return;
    }
    layer.initialised = true;

    layer.level0Nodes = [];

    Fetcher.json(layer.url).then((tileset) => {
        layer.tileIndex = new ThreeDTilesIndex(tileset);
        const lvl0Tiles = tileset.root.children;
        for (let i = 0; i < lvl0Tiles.length; i++) {
            requestNewTile(context.scheduler, layer, lvl0Tiles[i], undefined).then(
                (node) => {
                    // TODO: support a layer.root attribute, to be able
                    // to add a layer to a three.js node
                    context.scene.gfxEngine.scene3D.add(node);
                    layer.level0Nodes.push(node);
                });
        }
    });
}

export function process3DTilesNode(context, layer, node) {
    // early exit if parent' subdivision is in progress
    if (node.parent.pendingSubdivision2 && !node.parent.additiveRefinement) {
        node.visible = false;
        if (node.material) {
            node.material.visible = false;
        }
        return undefined;
    }

    // do proper culling
    const isVisible = layer.cullingTest ? (!layer.cullingTest(node, context.camera)) : true;
    node.visible = isVisible;

    let returnValue;

    if (isVisible) {
        if (node.pendingSubdivision2 || layer.mustSubdivide(context, layer, node)) {
            subdivideNode(context, layer, node);
            // display iff children aren't ready
            if (node.material) {
                node.material.visible = node.pendingSubdivision2 || node.additiveRefinement;
            }
            returnValue = node.children.filter(n => n.layer == layer.id);
        } else if (node.material) {
            node.material.visible = true;
        }

        if ((node.material === undefined || node.material.visible) && !node.additiveRefinement) {
            for (const n of node.children.filter(n => n.layer == layer.id)) {
                n.visible = false;
                if (n.material) {
                    n.material.visible = false;
                }
            }
        }

        return returnValue;
    }

    if (node.material) {
        node.material.visible = false;
    }

    // TODO: cleanup tree
    return undefined;
}

export function threeDTilesSubdivisionControl(context, layer, node) {
    const sse = computeNodeSSE(context.camera, node);

    return sse > 1.0;
}
