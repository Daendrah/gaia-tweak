export const COMMON_VERTEX_SHADER = `
  precision highp float;
  
  out vec3 vPosition;
  out vec2 vUV;
  
  void main() {
    vPosition = position;
    vUV = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
