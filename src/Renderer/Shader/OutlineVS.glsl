#ifdef USE_LOGDEPTHBUF

    #define EPSILON 1e-6
    #ifdef USE_LOGDEPTHBUF_EXT

        varying float vFragDepth;

    #endif

    uniform float logDepthBufFC;

#endif

uniform mat4       mVPMatRTC;
uniform int        RTC;
varying float      light;
const vec3 dir =  normalize(vec3(1.0,1.0,0.5));
attribute vec3 center;
varying vec3 vCenter;

void main()
{
  vCenter = center;

  if(RTC == 0)
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position,  1.0 );
  else
        gl_Position = mVPMatRTC * vec4( position ,1.0 );

    float h  = 1.0;//max(0.05,(1.0 - min(position.y / 50.0,1.0)));

    light    =   min(1.0, 0.4 + 0.8 * max(0.0, dot(dir,normal)));

    #ifdef USE_LOGDEPTHBUF

        gl_Position.z = log2(max( EPSILON, gl_Position.w + 1.0 )) * logDepthBufFC;

        #ifdef USE_LOGDEPTHBUF_EXT

            vFragDepth = 1.0 + gl_Position.w;

        #else

            gl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;

        #endif

    #endif

}
