export const SUN_VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const SUN_FRAGMENT_SHADER = `
  uniform vec3 u_innerColor;
  uniform vec3 u_outerColor;
  uniform float u_edgePower;
  uniform float u_intensity;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    float fresnel = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), u_edgePower);
    vec3 color = mix(u_innerColor, u_outerColor, fresnel);
    float alpha = fresnel * u_intensity;
    gl_FragColor = vec4(color, alpha);
  }
`;
