export const STARS_FRAGMENT_SHADER = `
  precision highp float;
  
  uniform bool u_enabled;
  uniform samplerCube u_backgroundTexture;
  uniform float u_starsDensity;
  uniform float u_starsGridScale;
  uniform float u_starSizeBase;
  uniform float u_starSizeVariation;
  uniform vec3 u_starColor;
  uniform float u_starColorVariation;
  uniform vec3 u_horizonColor;
  
  in vec3 vPosition;
  in vec2 vUV;
  
  out vec4 fragColor;
  
  float hash31(vec3 p3) {
    p3 = fract(p3 * 0.1031);
    p3 += dot(p3, p3.zyx + 31.32);
    return fract((p3.x + p3.y) * p3.z);
  }
  
  vec3 hash33(vec3 p3) {
    p3 = fract(p3 * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yxz + 33.33);
    return fract((p3.xxy + p3.yxx) * p3.zyx);
  }
  
  vec3 hash13(float p) {
    vec3 p3 = fract(vec3(p) * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xxy + p3.yzz) * p3.zyx);
  }
  
  vec4 generateStarLayer(vec3 direction, float scale, float seed) {
    
    vec3 p = direction * scale;
    vec3 cellBase = floor(p);
    vec3 cellFract = fract(p);
    float minDist = 1e10;
    vec3 closestStarPos = vec3(0.0);
    float closestStarHash = 0.0;
    
    for (int x = -1; x <= 1; x++) {
      for (int y = -1; y <= 1; y++) {
        for (int z = -1; z <= 1; z++) {
          vec3 cellOffset = vec3(float(x), float(y), float(z));
          vec3 cell = cellBase + cellOffset;
          float cellHash = hash31(cell + seed);
          if (cellHash < u_starsDensity) {
            continue;
          }
          
          vec3 starOffset = hash33(cell + seed * 7.13);
          vec3 starPos = cell + starOffset;
          vec3 diff = p - starPos;
          float dist = length(diff);
          
          if (dist < minDist) {
            minDist = dist;
            closestStarPos = starPos;
            closestStarHash = cellHash;
          }
        }
      }
    }
    
    if (minDist > 1.0) {
      return vec4(0.0);
    }
    
    float starSeed = hash31(closestStarPos + seed);
    float starSize = u_starSizeBase + starSeed * u_starSizeVariation;
    float intensity = smoothstep(starSize, 0.0, minDist);
    float core = smoothstep(starSize * 0.3, 0.0, minDist);
    intensity = mix(intensity, 1.0, core * 0.5);
    
    float temperature = starSeed;
    vec3 starColorBase = u_starColor;
    
    if (temperature < 0.3) {
      starColorBase = mix(u_starColor, vec3(0.7, 0.8, 1.0), u_starColorVariation);
    } else if (temperature < 0.6) {
      starColorBase = u_starColor;
    } else if (temperature < 0.85) {
      starColorBase = mix(u_starColor, vec3(1.0, 0.95, 0.8), u_starColorVariation);
    } else {
      starColorBase = mix(u_starColor, vec3(1.0, 0.7, 0.5), u_starColorVariation);
    }
    
    float brightness = 0.5 + starSeed * 0.5;
    return vec4(starColorBase * brightness, intensity);
  }
  
  void main() {
    vec3 direction = normalize(vPosition);
    vec3 backgroundColor = texture(u_backgroundTexture, direction).rgb;
    if (!u_enabled) {
      fragColor = vec4(backgroundColor, 1.0);
      return;
    }
    
    vec3 color = backgroundColor;
    vec4 stars1 = generateStarLayer(direction, u_starsGridScale, 1.0);
    vec4 stars2 = generateStarLayer(direction, u_starsGridScale * 1.5, 2.0);
    vec4 stars3 = generateStarLayer(direction, u_starsGridScale * 0.7, 3.0);
    vec4 starsTotal = stars1 + stars2 * 0.6 + stars3 * 0.4;
    starsTotal = clamp(starsTotal, 0.0, 1.0);
    
    float contextMask = smoothstep(0.0, 0.3, distance(u_horizonColor, backgroundColor));
    float starAlpha = starsTotal.w * contextMask;
    color = mix(color, starsTotal.xyz, starAlpha);
    color += starsTotal.xyz * starsTotal.w * 0.1; 
    
    fragColor = vec4(color, 1.0);
  }
`;
