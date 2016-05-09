/**
* Class: FeatureTile
* Description: Tile containing a set of 3D features
*/


define('Tiles/FeatureTile',[
	'Core/defaultValue',
    'Scene/BoundingBox',
	'Renderer/NodeMesh',
    'Renderer/OutlineMaterial',
    'THREE'], function(defaultValue, BoundingBox, NodeMesh, OutlineMaterial, THREE){

	function FeatureTile(params){
        //Constructor
        NodeMesh.call( this );
        this.bboxId = params.id;
        this.bbox = new BoundingBox(params.bbox[0], params.bbox[2],
            params.bbox[1], params.bbox[3]);
		this.level = params.level;
        this.childrenBboxes = [];
        this.geometricError = ((params.bbox[2] - params.bbox[0]) +
            (params.bbox[3] - params.bbox[1])) / 100;
        // TODO: geometric error doesn't really make sense in our case

        this.material = new OutlineMaterial(new THREE.Color(0.8,0.8,0.8));

		this.updateGeometry = true;
    }

    FeatureTile.prototype = Object.create( NodeMesh.prototype );

    FeatureTile.prototype.constructor = FeatureTile;

	FeatureTile.prototype.setGeometry = function(geometry) {
		this.geometry = geometry;
		this.geometry.translate(this.bbox.minCarto.longitude, this.bbox.minCarto.latitude, 0);
        this.geometry.computeBoundingSphere();
        this.centerSphere = this.geometry.boundingSphere.center;

		this.updateGeometry = false;
		this.cullable = true;
	};

	FeatureTile.prototype.setChildrenBoundingBoxes = function(bboxes) {
		this.childrenBboxes = bboxes;
	};

	FeatureTile.prototype.ready = function () {
		return !this.updateGeometry;
	};

	FeatureTile.prototype.getStatus = function () {
		var status = [];
		if(this.updateGeometry) {
			status.push("geometry");
		}
		return status;
	};

    FeatureTile.prototype.enableRTC = function(enable)
    {
        this.material.enableRTC(enable);
    };

    FeatureTile.prototype.enablePickingRender = function(enable)
    {
        this.material.enablePickingRender(enable);
    };

    FeatureTile.prototype.setFog = function(fog)
    {
        this.material.setFogDistance(fog);
    };

    FeatureTile.prototype.setMatrixRTC = function(rtc)
    {
        this.material.setMatrixRTC(rtc);
    };

    FeatureTile.prototype.setDebug = function(enable)
    {
        this.material.setDebug(enable);
    };

    FeatureTile.prototype.setSelected = function(select)
    {
        this.material.setSelected(select);
    };

    return FeatureTile;
});
