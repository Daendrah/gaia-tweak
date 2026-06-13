import * as THREE from 'three';
import { BiomeType, BIOME_COLORS } from './biomes.types';

// Find moisture seed regions (riverbanks and lakeshores)
export async function findMoistureSeeds(
  mesh: any,
  water_r: boolean[],
  ocean_r: boolean[],
  flow_s: number[]
): Promise<number[]> {
  const seeds = new Set<number>();

  // Find riverbanks (regions adjacent to sides with flow)
  for (let s = 0; s < mesh.numSides; s++) {
    if (flow_s[s] > 0) {
      // Add both regions adjacent to this side
      // In production: use mesh.r_begin_s(s) and mesh.r_end_s(s)
      // For now, simplified
    }
  }

  // Find lakeshores (regions adjacent to non-ocean water)
  for (let r = 0; r < mesh.numSolidRegions; r++) {
    if (water_r[r] && !ocean_r[r]) {
      // Find adjacent land regions
      // In production: use mesh.r_around_r(r)
    }
  }

  return Array.from(seeds);
}

// Assign moisture to regions using BFS from seeds
export async function assignMoistureRegions(
  mesh: any,
  water_r: boolean[],
  seeds: number[]
): Promise<{ moisture_r: number[]; waterdistance_r: number[] }> {
  const moisture_r = new Array(mesh.numRegions).fill(0);
  const waterdistance_r = new Array(mesh.numRegions).fill(Infinity);

  // BFS from moisture seeds
  const queue: number[] = [...seeds];
  seeds.forEach(r => {
    waterdistance_r[r] = 0;
  });

  let maxDistance = 0;

  while (queue.length > 0) {
    const r = queue.shift()!;
    const currentDistance = waterdistance_r[r];

    // Get neighbors (simplified)
    // In production: mesh.r_around_r(r, neighbors)
    const neighbors: number[] = [];

    for (const neighbor of neighbors) {
      if (water_r[neighbor]) continue; // Skip water regions

      const newDistance = currentDistance + 1;
      if (newDistance < waterdistance_r[neighbor]) {
        waterdistance_r[neighbor] = newDistance;
        if (newDistance > maxDistance) maxDistance = newDistance;
        queue.push(neighbor);
      }
    }
  }

  // Convert distance to moisture (power function for gradual falloff)
  for (let r = 0; r < mesh.numRegions; r++) {
    if (water_r[r]) {
      moisture_r[r] = 1.0;
    } else if (waterdistance_r[r] === Infinity) {
      moisture_r[r] = 0.0;
    } else {
      const d = waterdistance_r[r];
      moisture_r[r] = 1.0 - Math.pow(d / maxDistance, 0.5);
    }
  }

  return { moisture_r, waterdistance_r };
}

// Redistribute moisture for even distribution
export async function redistributeMoisture(
  mesh: any,
  water_r: boolean[],
  moisture_r: number[],
  moistureBias: number,
  minMoisture: number,
  maxMoisture: number
): Promise<void> {
  // Collect land regions
  const landRegions: { index: number; moisture: number }[] = [];

  for (let r = 0; r < mesh.numSolidRegions; r++) {
    if (!water_r[r]) {
      landRegions.push({ index: r, moisture: moisture_r[r] });
    }
  }

  // Sort by moisture
  landRegions.sort((a, b) => a.moisture - b.moisture);

  // Reassign linearly
  for (let i = 0; i < landRegions.length; i++) {
    const t = i / (landRegions.length - 1);
    let newMoisture = minMoisture + (maxMoisture - minMoisture) * t;
    newMoisture += moistureBias;
    newMoisture = Math.max(0, Math.min(1, newMoisture));
    moisture_r[landRegions[i].index] = newMoisture;
  }
}

// Assign coastal regions
export async function assignCoastRegions(mesh: any, ocean_r: boolean[]): Promise<boolean[]> {
  const coast_r = new Array(mesh.numRegions).fill(false);

  for (let r = 0; r < mesh.numSolidRegions; r++) {
    if (ocean_r[r]) continue;

    // Check if any neighbor is ocean
    // In production: mesh.r_around_r(r, neighbors)
    let hasOceanNeighbor = false;

    if (hasOceanNeighbor) {
      coast_r[r] = true;
    }
  }

  return coast_r;
}

// Assign temperature based on elevation and latitude
export async function assignTemperatureRegions(
  mesh: any,
  elevation_r: number[],
  northTempBias: number,
  southTempBias: number
): Promise<number[]> {
  const temperature_r = new Array(mesh.numRegions).fill(0);
  const bounds = 1000; // Mesh bounds

  for (let r = 0; r < mesh.numRegions; r++) {
    const point = mesh.points[r];
    const latitude = point[1] / bounds; // 0 = north, 1 = south

    // Base temperature decreases with elevation
    const baseTemp = 1.0 - elevation_r[r];

    // Apply latitude bias
    const tempBias = northTempBias + (southTempBias - northTempBias) * latitude;

    temperature_r[r] = baseTemp + tempBias;
  }

  return temperature_r;
}

// Biome classification function
function classifyBiome(
  ocean: boolean,
  water: boolean,
  coast: boolean,
  temperature: number,
  moisture: number
): BiomeType {
  // Water bodies
  if (ocean) return BiomeType.OCEAN;
  if (water) {
    if (temperature > 0.9) return BiomeType.MARSH;
    if (temperature < 0.2) return BiomeType.ICE;
    return BiomeType.LAKE;
  }

  // Coastal
  if (coast) return BiomeType.BEACH;

  // Land biomes based on temperature and moisture
  if (temperature < 0.2) {
    // Cold
    if (moisture > 0.5) return BiomeType.SNOW;
    if (moisture > 0.33) return BiomeType.TUNDRA;
    if (moisture > 0.16) return BiomeType.BARE;
    return BiomeType.SCORCHED;
  } else if (temperature < 0.4) {
    // Cool
    if (moisture > 0.66) return BiomeType.TAIGA;
    if (moisture > 0.33) return BiomeType.SHRUBLAND;
    return BiomeType.TEMPERATE_DESERT;
  } else if (temperature < 0.7) {
    // Warm
    if (moisture > 0.83) return BiomeType.TEMPERATE_RAIN_FOREST;
    if (moisture > 0.5) return BiomeType.TEMPERATE_DECIDUOUS_FOREST;
    if (moisture > 0.16) return BiomeType.GRASSLAND;
    return BiomeType.TEMPERATE_DESERT;
  } else {
    // Hot
    if (moisture > 0.66) return BiomeType.TROPICAL_RAIN_FOREST;
    if (moisture > 0.33) return BiomeType.TROPICAL_SEASONAL_FOREST;
    if (moisture > 0.16) return BiomeType.GRASSLAND;
    return BiomeType.SUBTROPICAL_DESERT;
  }
}

// Assign biomes to all regions
export async function assignBiomeRegions(
  mesh: any,
  ocean_r: boolean[],
  water_r: boolean[],
  coast_r: boolean[],
  temperature_r: number[],
  moisture_r: number[]
): Promise<BiomeType[]> {
  const biome_r = new Array(mesh.numRegions) as BiomeType[];

  for (let r = 0; r < mesh.numRegions; r++) {
    biome_r[r] = classifyBiome(ocean_r[r], water_r[r], coast_r[r], temperature_r[r], moisture_r[r]);
  }

  return biome_r;
}

// Update terrain mesh colors based on biomes
export async function updateTerrainColors(
  terrainMesh: THREE.Object3D,
  mesh: any,
  biome_r: BiomeType[],
  water_r: boolean[]
): Promise<void> {
  if (!(terrainMesh instanceof THREE.Group)) return;

  terrainMesh.traverse(child => {
    if (child instanceof THREE.Mesh) {
      const geometry = child.geometry;
      const colorAttr = geometry.getAttribute('color');

      if (!colorAttr) return;

      const colors = colorAttr.array as Float32Array;

      // Update colors based on biomes
      for (let i = 0; i < colors.length / 3; i++) {
        // Map vertex to region (simplified)
        const r = i % mesh.numSolidRegions;

        if (water_r[r]) continue; // Skip water regions

        const biome = biome_r[r];
        const color = new THREE.Color(BIOME_COLORS[biome]);

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }

      colorAttr.needsUpdate = true;
    }
  });
}
