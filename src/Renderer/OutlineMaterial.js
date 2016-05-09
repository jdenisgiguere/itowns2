/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


define('Renderer/OutlineMaterial',
    [   'THREE',
        'Core/defaultValue',
        'Renderer/Shader/OutlineVS.glsl',
        'Renderer/Shader/OutlineFS.glsl'], function(
            THREE,
            defaultValue,
            OutlineVS,
            OutlineFS)
    {

        function OutlineMaterial(color){
            //Constructor

            THREE.ShaderMaterial.call( this );

            this.vertexShader    = OutlineVS;
            this.fragmentShader  = OutlineFS;

            this.attributes = {
                'center': { type: 'v3', value: null }
            };

            this.uniforms  =
            {
                diffuseColor    : { type: "c", value: defaultValue(color,new THREE.Color()) },
                RTC             : { type: "i" , value: 1 },
                mVPMatRTC       : { type: "m4", value: new THREE.Matrix4()},
                distanceFog     : { type: "f" , value: 1000000000.0},
                uuid            : { type: "i" , value: 0},
                debug           : { type: "i" , value: false },
                selected        : { type: "i" , value: false }

            };
        }

        OutlineMaterial.prototype = Object.create( THREE.ShaderMaterial.prototype );
        OutlineMaterial.prototype.constructor = OutlineMaterial;

        OutlineMaterial.prototype.enableRTC = function(enable)
        {
            this.uniforms.RTC.value   = enable === true ? 1 : 0;
        };

        OutlineMaterial.prototype.setDebug = function(debug_value)
        {
            this.uniforms.debug.value   = debug_value;
        };

        OutlineMaterial.prototype.setMatrixRTC = function(rtc)
        {
            this.uniforms.mVPMatRTC.value  = rtc;
        };
        OutlineMaterial.prototype.setUuid = function(uuid)
        {
            this.uniforms.uuid.value  = uuid;
        };

        OutlineMaterial.prototype.setFogDistance = function(df)
        {
            this.uniforms.distanceFog.value  = df;
        };

        OutlineMaterial.prototype.setSelected = function(selected)
        {
            this.uniforms.selected.value  = selected;
        };

        return OutlineMaterial;

    });
