#extension GL_OES_standard_derivatives: enable

#ifdef USE_LOGDEPTHBUF

	uniform float logDepthBufFC;

	#ifdef USE_LOGDEPTHBUF_EXT

		//#extension GL_EXT_frag_depth : enable
		varying float vFragDepth;

	#endif

#endif

uniform vec3 diffuseColor;
varying float      light;

varying vec3 vCenter;

float edgeFactorTri() {
    vec3 d = fwidth(vCenter.xyz);
    vec3 a3 = smoothstep(vec3(0.0), d * 1.5, vCenter.xyz);
    return min(min(a3.x, a3.y), a3.z);
}

void main() {

    #if defined(USE_LOGDEPTHBUF) && defined(USE_LOGDEPTHBUF_EXT)

	gl_FragDepthEXT = log2(vFragDepth) * logDepthBufFC * 0.5;

    #endif

    vec4 color    =  vec4( diffuseColor * light,1.0) ;

    gl_FragColor.rgb = mix(vec3(0.0), color.rgb, edgeFactorTri());
    gl_FragColor.a = 1.0;
    //gl_FragColor = color;
}
