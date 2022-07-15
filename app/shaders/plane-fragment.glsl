precision highp float;

uniform sampler2D tMap;
varying vec2 vUv;
uniform vec2 uResolution;

void main() {
  vec4 texture = texture2D(tMap, vUv);
  gl_FragColor = texture;
  // gl_FragColor.a = uAlpha;
}