export const SUN_VERTEX_SHADER = `
  precision highp float;
  
  out vec3 v_normal;
  
  void main() {
    v_normal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const SUN_FRAGMENT_SHADER = `
  precision highp float;
  
  uniform vec3 u_innerColor;
  uniform vec3 u_outerColor;
  uniform float u_edgePower;
  uniform float u_intensity;
  
  in vec3 v_normal;
  
  out vec4 fragColor;
  
  void main() {
    // Calculate camera direction in world space
    vec3 cameraDirection = normalize((inverse(viewMatrix) * vec4(0.0, 0.0, -1.0, 0.0)).xyz);
    
    // Calculate intensity based on view angle
    float intensity = -dot(v_normal, cameraDirection);
    
    // Apply edge power for soft edges
    intensity = clamp(pow(intensity, u_edgePower), 0.0, 1.0);
    
    // Mix colors based on intensity
    vec3 color = mix(u_outerColor, u_innerColor, intensity);
    color = color * u_intensity;
    
    fragColor = vec4(color, 1.0);
  }
`;
