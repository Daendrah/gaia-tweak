import * as THREE from 'three';

// Seeded random for river selection
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

// Find river spring sources
export async function findRiverSprings(
  mesh: any,
  water_r: boolean[],
  elevation_t: number[]
): Promise<number[]> {
  const MIN_SPRING_ELEVATION = 0.3;
  const MAX_SPRING_ELEVATION = 0.9;
  const t_spring: number[] = [];

  for (let t = 0; t < mesh.numTriangles; t++) {
    const elevation = elevation_t[t];

    if (elevation < MIN_SPRING_ELEVATION || elevation > MAX_SPRING_ELEVATION) {
      continue;
    }

    // Check if any adjacent regions are water
    // Simplified: in production, check mesh.r_around_t(t)
    let isNearWater = false;
    // ... check logic would go here

    if (!isNearWater) {
      t_spring.push(t);
    }
  }

  return t_spring;
}

// Assign river flow
export async function assignRiverFlow(
  mesh: any,
  t_spring: number[],
  s_downslope_t: number[],
  numRivers: number,
  seed: number
): Promise<{ t_river: number[]; flow_s: number[] }> {
  const random = new SeededRandom(seed);
  const shuffled = random.shuffle(t_spring);
  const t_river = shuffled.slice(0, Math.min(numRivers, shuffled.length));

  const flow_s = new Array(mesh.numSides).fill(0);

  // Trace each river downhill
  for (const springTriangle of t_river) {
    let t = springTriangle;
    const visited = new Set<number>();

    while (t !== -1 && !visited.has(t)) {
      visited.add(t);

      const s = s_downslope_t[t];
      if (s === -1) break; // Reached sink

      flow_s[s]++;

      // Move to next triangle (simplified)
      // In production: t = mesh.t_outer_s(s)
      break; // Placeholder
    }
  }

  return { t_river, flow_s };
}

// Create ocean mesh
export async function createOceanMesh(
  mesh: any,
  ocean_r: boolean[],
  oceanLevel: number,
  oceanColor: string,
  oceanOpacity: number,
  reflectivity: number
): Promise<THREE.Mesh> {
  const geometry = new THREE.BufferGeometry();
  const vertices: number[] = [];
  const indices: number[] = [];

  const color = new THREE.Color(oceanColor);

  // Build ocean mesh from regions
  for (let r = 0; r < mesh.numSolidRegions; r++) {
    if (!ocean_r[r]) continue;

    const point = mesh.points[r];

    // Add vertex
    vertices.push(point[0] - 500, oceanLevel, point[1] - 500);

    // Simplified triangulation
    // In production: proper mesh triangulation
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    color: color,
    transparent: true,
    opacity: oceanOpacity,
    metalness: 0.1,
    roughness: 1 - reflectivity,
    side: THREE.DoubleSide,
  });

  const oceanMesh = new THREE.Mesh(geometry, material);
  oceanMesh.receiveShadow = true;

  return oceanMesh;
}

// Create lake meshes
export async function createLakeMeshes(
  mesh: any,
  water_r: boolean[],
  ocean_r: boolean[],
  elevation_r: number[],
  lakeColor: string,
  lakeOpacity: number,
  reflectivity: number
): Promise<THREE.Group> {
  const group = new THREE.Group();
  const color = new THREE.Color(lakeColor);

  // Find lake regions (water but not ocean)
  const lakeRegions: number[] = [];
  for (let r = 0; r < mesh.numSolidRegions; r++) {
    if (water_r[r] && !ocean_r[r]) {
      lakeRegions.push(r);
    }
  }

  // Group lakes by connected components
  // Simplified: create individual meshes for each lake region
  for (const r of lakeRegions) {
    const point = mesh.points[r];
    const elevation = elevation_r[r];

    // Create a simple plane for the lake
    const geometry = new THREE.CircleGeometry(10, 16);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      transparent: true,
      opacity: lakeOpacity,
      metalness: 0.1,
      roughness: 1 - reflectivity,
      side: THREE.DoubleSide,
    });

    const lakeMesh = new THREE.Mesh(geometry, material);
    lakeMesh.position.set(point[0] - 500, elevation, point[1] - 500);
    lakeMesh.rotation.x = -Math.PI / 2;
    lakeMesh.receiveShadow = true;

    group.add(lakeMesh);
  }

  return group;
}

// Create river meshes
export async function createRiverMeshes(
  mesh: any,
  flow_s: number[],
  elevation_r: number[],
  riverColor: string,
  riverWidth: number
): Promise<THREE.Group> {
  const group = new THREE.Group();
  const color = new THREE.Color(riverColor);

  // Create river segments where flow > 0
  for (let s = 0; s < mesh.numSides; s++) {
    const flow = flow_s[s];
    if (flow <= 0) continue;

    // Calculate river width based on flow
    const width = riverWidth * Math.sqrt(flow);

    // Get side endpoints (simplified)
    // In production: use mesh.r_begin_s(s) and mesh.r_end_s(s)
    // Then get positions and elevations

    // Create a simple cylinder for the river segment
    const geometry = new THREE.CylinderGeometry(width / 2, width / 2, 10, 8);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      metalness: 0.2,
      roughness: 0.8,
    });

    const riverSegment = new THREE.Mesh(geometry, material);
    // Position would be calculated from mesh data
    riverSegment.receiveShadow = true;
    riverSegment.castShadow = true;

    group.add(riverSegment);
  }

  return group;
}
