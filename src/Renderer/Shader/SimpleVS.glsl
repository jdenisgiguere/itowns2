#ifdef USE_LOGDEPTHBUF
    
    #define EPSILON 1e-6
    #ifdef USE_LOGDEPTHBUF_EXT

        varying float vFragDepth;

    #endif

    uniform float logDepthBufFC;

#endif

uniform mat4       mVPMatRTC;
uniform int        RTC;
varying float      ZY;

void main() 
{

  if(RTC == 0)
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position,  1.0 );
  else
        gl_Position = mVPMatRTC * vec4( position ,1.0 );
    
    ZY= position.y / 100.0;

    #ifdef USE_LOGDEPTHBUF

        gl_Position.z = log2(max( EPSILON, gl_Position.w + 1.0 )) * logDepthBufFC;

        #ifdef USE_LOGDEPTHBUF_EXT

            vFragDepth = 1.0 + gl_Position.w;

        #else

            gl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;

        #endif

    #endif
        
}   