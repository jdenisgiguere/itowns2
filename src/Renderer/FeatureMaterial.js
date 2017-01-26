/**
 * Generated On: 2016-07-11
 * Class: FeatureMaterial
 * Description: Materiel d'une tuile correspondant à un layer a poser au dessus des tuiles de terrains.
 */

import FeatureVS from './Shader/FeatureVS.glsl';
import FeatureFS from './Shader/FeatureFS.glsl';
import BasicMaterial from './BasicMaterial';

function FeatureMaterial() {
    BasicMaterial.call(this);

    this.vertexShader = FeatureVS;
    this.fragmentShader = FeatureFS;
}

FeatureMaterial.prototype = Object.create(BasicMaterial.prototype);
FeatureMaterial.prototype.constructor = FeatureMaterial;

FeatureMaterial.prototype.setVisibility = function setVisibility(visible) {
    this.visible = visible;
};

export default FeatureMaterial;
