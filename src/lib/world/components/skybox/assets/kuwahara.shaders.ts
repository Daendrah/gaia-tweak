export const KUWAHARA_FRAGMENT_SHADER = `
  precision highp float;
  
  uniform bool u_enabled;
  uniform samplerCube u_backgroundTexture;
  uniform float u_filterRadius;
  uniform float u_sampleOffset;
  
  in vec3 vPosition;
  in vec2 vUV;
  
  out vec4 fragColor;
  
  vec3 sampleBackground(const vec3 direction, const vec2 offset) {
    vec3 up = abs(direction.y) < 0.999 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
    vec3 tangent = normalize(cross(up, direction));
    vec3 bitangent = normalize(cross(direction, tangent));
    vec3 offsetDir = direction + tangent * offset.x * u_sampleOffset + bitangent * offset.y * u_sampleOffset;
    return texture(u_backgroundTexture, normalize(offsetDir)).rgb;
  }
  
  vec4 generatePainterly(const vec3 direction) {
    float R = u_filterRadius;
    float n = (R + 1.0) * (R + 1.0);  
    vec3 m[4];  
    vec3 s[4];  
    
    for (int i = 0; i < 4; i++) {
      m[i] = vec3(0.0);
      s[i] = vec3(0.0);
    }
    
    for (float y = -R; y <= 0.0; y++) {
      for (float x = -R; x <= 0.0; x++) {
        vec3 c = sampleBackground(direction, vec2(x, y));
        m[0] += c;
        s[0] += c * c;
      }
    }
    
    for (float y = -R; y <= 0.0; y++) {
      for (float x = 0.0; x <= R; x++) {
        vec3 c = sampleBackground(direction, vec2(x, y));
        m[1] += c;
        s[1] += c * c;
      }
    }
    
    for (float y = 0.0; y <= R; y++) {
      for (float x = -R; x <= 0.0; x++) {
        vec3 c = sampleBackground(direction, vec2(x, y));
        m[2] += c;
        s[2] += c * c;
      }
    }
    
    for (float y = 0.0; y <= R; y++) {
      for (float x = 0.0; x <= R; x++) {
        vec3 c = sampleBackground(direction, vec2(x, y));
        m[3] += c;
        s[3] += c * c;
      }
    }
    
    vec3 means[4];
    vec3 vars[4];
    
    for (int i = 0; i < 4; i++) {
      means[i] = m[i] / n;
      
      vars[i] = s[i] / n - means[i] * means[i];
    }
    
    float minVar = 1e12;
    vec3 col = vec3(0.0);
    
    for (int i = 0; i < 4; i++) {
      float v = vars[i].r + vars[i].g + vars[i].b;
      if (v < minVar) {
        minVar = v;
        col = means[i];
      }
    }
    
    return vec4(col, 1.0);
  }
  
  void main() {
    vec3 direction = normalize(vPosition);
    
    if (!u_enabled) {
      fragColor = texture(u_backgroundTexture, direction);
      return;
    }
    
    vec4 painterly = generatePainterly(direction);
    fragColor = painterly;
  }
`;
