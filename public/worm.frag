
// Fragment shader

// #ifdef GL_ES
precision mediump float;
#endif

#define rot(a) mat2(cos(a+vec4(0,33,11,0)))

uniform vec2 u_resolution;
uniform float u_time;


// Uniforms
//   u_resolution - The size of the canvas
//   u_time       - The elapsed time since the program started

// Main function
void main() {
    // Get the size of the canvas
    vec2 r = u_resolution;
    // Get the pixel position
    vec2 u = gl_FragCoord.xy;

    u *= sin(u / u_time * 20.) * 0.02; // ?(experimental) (comment out the line below)

    u += u - r; // mirror

    // Set the output color
    vec4 O = vec4(0);

    // Set the time
    float t = 0.;
    // Set the distance
    float d = 0.;
    // Set the movement
    float m = u_time * 2.;

    // Loop 100 times
    for (float i = 0.; i < 1e2; i++) {
        // Get the position
        vec3 p = t * normalize(vec3(abs(u/r.y),1.));

        // Get the distance
        d = length(p - vec3(0, 0, 15)) - 1.0;
        // Set the output color
        O += 0.2 * vec4(1., .6, .2, .0) / (1. + d /.1);
        // Add the movement
        p.z += m;
        // Set the position
        p.xy = fract(p.xy * rot(sin(p.z) * .3 * sin(m)))-.5;

        // float f = u_time * .001;
        float f = .1;

        // Get the distance
        t += d = min(d, length(p.xy) - f);

        // Set the output color
        O += .05 * smoothstep(0., 1., cos(t*.1*(sin(m) + 20.) + vec4(0., 1, 2, 0) * (.15 + length(p.xy) * 2.) -m) -.6) / (1. + d) / exp(t * .1) * smoothstep(0., 1., m*.2 - .2);
    }

    // Set the output color
}