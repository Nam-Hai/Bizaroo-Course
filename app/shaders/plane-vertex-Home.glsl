#define PI 3.1415926535

attribute vec2 uv;
attribute vec3 position;

uniform vec2 uViewportSizes;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;

void main() {
  vUv = uv;
  vec4 newPosition = modelViewMatrix * vec4(position, 1.0);

  newPosition.z -= (cos((newPosition.y / uViewportSizes.y) * PI) / 2.0 + cos((newPosition.x / uViewportSizes.x) * PI) / 2.0);

  gl_Position = projectionMatrix * newPosition;
}
