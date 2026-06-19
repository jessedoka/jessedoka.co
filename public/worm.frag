
#ifdef GL_ES
precision mediump float;
#endif

#define rot(a) mat2(cos(a+vec4(0,33,11,0)))

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_zoom;

float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
    vec2 res = u_resolution;
    vec2 ndc = gl_FragCoord.xy / res * 2.0 - 1.0;
    float r2 = dot(ndc, ndc);
    vec2 warpedNdc = ndc * (1.0 + 0.065 * r2);

    vec2 edgeDist = 1.0 - abs(warpedNdc);
    float screenMask = smoothstep(0.0, 0.025, edgeDist.x) * smoothstep(0.0, 0.025, edgeDist.y);

    vec2 u = warpedNdc * res;

    vec4 O = vec4(0);
    float t = 0.;
    float d = 0.;
    float m = u_time * 2.;

    for (float i = 0.; i < 1e2; i++) {
        vec3 p = t * normalize(vec3(abs(u / res.y), u_zoom > 0.0 ? u_zoom : 1.0));

        d = length(p - vec3(0, 0, 15)) - 1.0;
        O += 0.2 * vec4(1., .6, .2, .0) / (1. + d / .1);
        p.z += m;
        p.xy = fract(p.xy * rot(sin(p.z) * .3 * sin(m))) - .5;

        float f = .1;
        t += d = min(d, length(p.xy) - f);
        O += .05 * smoothstep(0., 1., cos(t * .1 * (sin(m) + 20.) + vec4(0., 1, 2, 0) * (.15 + length(p.xy) * 2.) - m) - .6) / (1. + d) / exp(t * .1) * smoothstep(0., 1., m * .2 - .2);
    }

    float yNorm = gl_FragCoord.y / res.y;
    O *= (1.0 - smoothstep(0.6, 1.0, yNorm) * 0.88);

    O *= 2.5;

    float scanline = 0.80 + 0.20 * sin(gl_FragCoord.y * 3.14159265);
    O.rgb *= scanline;

    float band = abs(fract(yNorm * 0.6 - u_time * 0.035) - 0.5) * 2.0;
    O.rgb *= (1.0 - smoothstep(0.93, 1.0, band) * 0.18);

    float noise = hash21(gl_FragCoord.xy + u_time * 17.3);
    O.rgb += (noise - 0.5) * 0.04;

    float flicker = 0.975 + 0.025 * sin(u_time * 60.0 * 3.14159265);
    O.rgb *= flicker;
    float vig = 1.0 - dot(ndc * 0.72, ndc * 0.72);
    O.rgb *= clamp(vig, 0.0, 1.0);
    O *= screenMask;

    gl_FragColor = O * 2.5;
}