
// Fragment shader



#ifdef GL_ES
precision mediump float;
#endif

#define rot(a) mat2(cos(a+vec4(0,33,11,0)))

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 r = u_resolution;
    vec2 u = gl_FragCoord.xy;

    u += u - r;



    vec4 O = vec4(0);

    float t = 0.;
    float d = 0.;
    float m = u_time * 2.;

    for (float i = 0.; i < 1e2; i++) {
        vec3 p = t * normalize(vec3(abs(u/r.y),1.));

        d = length(p - vec3(0, 0, 15)) - 1.0;
        O += 0.2 * vec4(1., .6, .2, .0) / (1. + d /.1);
        p.z += m;
        p.xy = fract(p.xy * rot(sin(p.z) * .3 * sin(m)))-.5;

        // float f = u_time * .001;
        float f = .1;

        t += d = min(d, length(p.xy) - f);
        O += .05 * smoothstep(0., 1., cos(t*.1*(sin(m) + 20.) + vec4(0., 1, 2, 0) * (.15 + length(p.xy) * 2.) -m) -.6) / (1. + d) / exp(t * .1) * smoothstep(0., 1., m*.2 - .2);
    }

    // Darken the top of the canvas to avoid clashing with overlaid text
    float yNorm = gl_FragCoord.y / r.y;
    O *= (1.0 - smoothstep(0.6, 1.0, yNorm) * 0.88);

    gl_FragColor = O;
}