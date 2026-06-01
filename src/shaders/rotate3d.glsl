#version 300 es
precision highp float;

#include "@motion-canvas/core/shaders/common.glsl"

uniform float angleX;
uniform float angleY;
uniform float focalLength;

void main() {
    vec2 centered = sourceUV - 0.5;

    float cax = cos(angleX);
    float sax = sin(angleX);
    float cay = cos(angleY);
    float say = sin(angleY);
    float f = focalLength;

    // Ray-plane intersection for composed rotation R = Ry(angleY) · Rx(angleX)
    // Plane normal n = R · (0,0,1), plane passes through origin
    // Ray: P = t * (sx, sy, f) from camera at (0, 0, -f) projected to z=0
    float denom = cax * say * centered.x - sax * centered.y + cax * cay * f;

    if (denom <= 0.0) {
        outColor = vec4(0.0);
        return;
    }

    float t = cax * cay * f / denom;
    vec3 P = vec3(t * centered.x, t * centered.y, f * (t - 1.0));

    // Inverse rotation R^-1 = Rx^T · Ry^T to recover texture coordinates
    // First apply Ry^T
    vec3 Q = vec3(P.x * cay - P.z * say, P.y, P.x * say + P.z * cay);
    // Then apply Rx^T (only need u and v)
    float u = Q.x;
    float v = Q.y * cax + Q.z * sax;

    vec2 origUV = vec2(u, v) + 0.5;

    if (origUV.x < 0.0 || origUV.x > 1.0 || origUV.y < 0.0 || origUV.y > 1.0) {
        outColor = vec4(0.0);
    } else {
        outColor = texture(sourceTexture, origUV);
    }
}
