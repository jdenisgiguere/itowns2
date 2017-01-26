/**
 * Generated On: 2016-05-27
 * Class: FeatureMesh
 * Description: Tuile correspondant à un layer à poser au dessus des tuiles de terrains.
 */

import * as THREE from 'three';
import FeatureMaterial from './FeatureMaterial';

function FeatureMesh(params) {
    THREE.Mesh.call(this);

    this.material = new FeatureMaterial();

    this.bboxId = params.id;
    this.bbox = params.bbox;

    /* this.box3D = new THREE.Box3(new THREE.Vector3(this.bbox.west(), this.bbox.south(), this.bbox.bottom()),
                        new THREE.Vector3(this.bbox.east(), this.bbox.north(), this.bbox.top()));*/
    this.centerSphere = new THREE.Vector3();
    this.level = params.level;
}

FeatureMesh.prototype = Object.create(THREE.Mesh.prototype);
FeatureMesh.prototype.constructor = FeatureMesh;

FeatureMesh.prototype.setSelected = function setSelected() {
};

FeatureMesh.prototype.enablePickingRender = function enablePickingRender(enable) {
    this.material.enablePickingRender(enable);
};

FeatureMesh.prototype.setGeometry = function setGeometry(geometry) {
    this.geometry = geometry;
};

FeatureMesh.prototype.setMatrixRTC = function setMatrixRTC(rtc) {
    this.material.setMatrixRTC(rtc);
};

FeatureMesh.prototype.setFog = function setFog(fog) {
    this.material.setFogDistance(fog);
};

FeatureMesh.prototype.setWireframed = function setWireframed() {
    this.material.wireframe = true;
    this.material.wireframeLineWidth = 20;
    this.material.linewidth = 20;
};

export default FeatureMesh;
