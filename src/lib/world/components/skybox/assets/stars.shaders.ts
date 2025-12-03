export const STARS_FRAGMENT_SHADER = `
  precision highp float;
  
  uniform bool u_enabled;
  uniform samplerCube u_backgroundTexture;
  uniform float u_starsDensity;
  uniform vec3 u_starColorBase;
  uniform vec3 u_starColorTint1;
  uniform vec3 u_starColorTint2;
  uniform float u_colorThreshold1;
  uniform float u_colorThreshold2;
  uniform float u_starBrightnessMax;
  uniform float u_starBrightnessMin;
  uniform float u_starSizeVariation;
  
  in vec3 v_position;
  in vec2 v_uv;
  
  out vec4 fragColor;
  
  float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  
  vec4 generateStars(vec2 uv) {
    float gridCount = 1.0 / (1.0 - clamp(u_starsDensity, 0.0, 1.0));
    vec2 grid = vec2(gridCount);
    vec2 sector = floor(uv * grid);
    vec3 starColor = vec3(0.0);
    
    for (int j = -1; j <= 1; ++j) {
      for (int i = -1; i <= 1; ++i) {
        vec2 neighborSector = sector + vec2(i, j);
        float starSeed = hash21(neighborSector);
        vec2 starPos = (neighborSector + vec2(
            hash21(neighborSector + 0.1),
            hash21(neighborSector + 0.2)
          )) / grid;
        
        float colorSeed = hash21(neighborSector + 0.3);
        vec3 starColorRamp;
        if (colorSeed < u_colorThreshold1) {
          float t = colorSeed / u_colorThreshold1;
          starColorRamp = mix(u_starColorTint1, u_starColorBase, t);
        } else if (colorSeed < u_colorThreshold2) {
          starColorRamp = u_starColorBase;
        } else {
          float t = (colorSeed - u_colorThreshold2) / (1.0 - u_colorThreshold2);
          starColorRamp = mix(u_starColorBase, u_starColorTint2, t);
        }
        
        float sizeSeed = hash21(neighborSector + 0.4);
        float starSize = (sizeSeed * u_starSizeVariation) / gridCount;
        float brightnessSeed = hash21(neighborSector + 0.5);
        float starBrightness = mix(u_starBrightnessMin, u_starBrightnessMax, brightnessSeed);
        float dist = length(uv - starPos);
        float starIntensity = smoothstep(starSize, 0.0, dist);
        
        starColor += starColorRamp * starIntensity * starBrightness;
      }
    }
    
    return vec4(starColor, length(starColor));
  }
  
  void main() {
    vec3 direction = normalize(v_position);
    vec3 backgroundColor = texture(u_backgroundTexture, direction).rgb;
    
    if (!u_enabled) {
      fragColor = vec4(backgroundColor, 1.0);
      return;
    }
    
    vec4 stars = generateStars(v_uv);
    
    float backgroundLuminance = dot(backgroundColor, vec3(0.299, 0.587, 0.114));
    float visibilityMask = smoothstep(0.4, 0.1, backgroundLuminance);
    
    float finalAlpha = stars.a * visibilityMask;
    fragColor = mix(vec4(backgroundColor, 1.0), stars, finalAlpha);
  }
`;
