#define PI 3.1415926535

attribute vec2 uv;
attribute vec3 position;

// uniform vec2 uViewportSizes;
uniform vec2 uVelocity;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;

void main() {
  vUv = uv;
  vec4 newPosition = vec4(position, 1.0);

  // newPosition.z -= (cos((newPosition.y ) * PI) * uVelocity.y / 2.0 + cos((newPosition.x ) * PI) * uVelocity.x / 2.0) ;
  newPosition.x += cos(newPosition.y * PI) * uVelocity.y * 7.0;
  // newPosition.y -= (cos(newPosition.y * PI) *  10.0);

  gl_Position = projectionMatrix * modelViewMatrix * newPosition;
}
