export const COMMON_VERTEX_SHADER = `
  precision highp float;
  
  out vec3 v_position;
  out vec2 v_uv;
  
  void main() {
    v_position = position;
    v_uv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
