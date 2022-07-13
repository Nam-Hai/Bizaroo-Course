// attribute vec4 a_position;

// uniform mat4 u_matrix;

// void main() {
//   // Multiply the position by the matrix.
//   gl_Position = u_matrix * a_position;
// }

attribute vec2 uv;
attribute vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;

void main() {
  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

