import * as THREE from 'three';
import OBB from '../Renderer/ThreeExtended/OBB';
import { Coordinates } from '../Core/Geographic/Coordinates';

function PlanarTileBuilder() {

}

PlanarTileBuilder.prototype.constructor = PlanarTileBuilder;

// prepare params
// init projected object -> params.projected
PlanarTileBuilder.prototype.Prepare = function Prepare(params) {
    params.nbRow = Math.pow(2.0, params.zoom + 1.0);
    params.projected = new THREE.Vector3();
};


// get center tile in cartesian 3D
PlanarTileBuilder.prototype.Center = function Center(params) {
    params.center = new THREE.Vector3(params.bbox.center().x(), params.bbox.center().y(), 0);
    return params.center;
};

// get position 3D cartesian
PlanarTileBuilder.prototype.VertexPosition = function VertexPosition(params) {
    return new Coordinates(params.bbox.crs(), params.projected.x, params.projected.y);
};

// get normal for last vertex
PlanarTileBuilder.prototype.VertexNormal = function VertexNormal(/* params */) {
    return new THREE.Vector3(0.0, 0.0, 1.0);
};

// coord u tile to projected
PlanarTileBuilder.prototype.uProjecte = function uProjecte(u, params) {
    params.projected.x = params.bbox.minCoordinate.x() + u * (params.bbox.maxCoordinate.x() - params.bbox.minCoordinate.x());
};

// coord v tile to projected
PlanarTileBuilder.prototype.vProjecte = function vProjecte(v, params)
{
    params.projected.y = params.bbox.minCoordinate.y() + v * (params.bbox.maxCoordinate.y() - params.bbox.minCoordinate.y());
};

// get oriented bounding box of tile
PlanarTileBuilder.prototype.OBB = function _OBB(params) {
    const center = params.bbox.center().xyz();
    const max = params.bbox.maxCoordinate.xyz().sub(center);
    const min = params.bbox.minCoordinate.xyz().sub(center);
    const translate = new THREE.Vector3(0, 0, 0);
    const normal = new THREE.Vector3(0, 0, 1);

    return new OBB(min, max, normal, translate);
};

export { PlanarTileBuilder };
