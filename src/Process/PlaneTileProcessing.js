import * as THREE from 'three';

import SchemeTile from '../Scene/SchemeTile';

const SSE_SUBDIVISION_THRESHOLD = 6.0;

const frustum = new THREE.Frustum();
const obbViewMatrix = new THREE.Matrix4();

function frustumCullingOBB(node, camera) {
    // Move camera in OBB local space
    node.OBB().updateMatrixWorld(true);
    obbViewMatrix.multiplyMatrices(camera.viewMatrix, node.OBB().matrixWorld);

    frustum.setFromMatrix(obbViewMatrix);

    return frustum.intersectsBox(node.OBB().box3D);
}

export function planeCulling(node, camera) {
    return !frustumCullingOBB(node, camera);
}

function computeNodeSSE(camera, node) {
    var vFOV = camera.FOV * Math.PI / 180;

    var diff = camera.camera3D.getWorldPosition().clone().sub(node.getWorldPosition());
    const dim = node.bbox.dimensions();
    var d = Math.max(0.1, diff.length() - (new THREE.Vector3(dim.x, dim.y, dim.z)).length() * 0.5);
    var height = 2 * Math.tan(vFOV / 2) * d;

    var dot = diff.normalize().z;

    var ratio = (dim.x * dot) / height;

    if (ratio >= 0.25) {
        return 7;
    }
    return 1;
}

export function planeSubdivisionControl(context, layer, node) {
    if (layer.maxLevel <= node.level) {
        return false;
    }

    const sse = computeNodeSSE(context.camera, node);

    return SSE_SUBDIVISION_THRESHOLD < sse;
}

export function planeSchemeTile(bbox) {
    const planeSchemeTile = new SchemeTile();
    planeSchemeTile.add(bbox);
    return planeSchemeTile;
}
