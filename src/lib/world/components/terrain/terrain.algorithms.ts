import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';
import Delaunator from 'delaunator';
import alea from 'alea';

export interface TerrainCell {
  id: number;
  center: [number, number];
  vertices: [number, number][];
  neighbors: number[];
}

export interface IslandCell {
  id: number;
  distanceToCoast: number;
  distanceToRidge: number;
  elevation: number;
}

export interface TerrainData {
  cells: TerrainCell[];
  islandCells: IslandCell[];
  ridgeCells: { id: number }[];
}

/**
 * Linear interpolation between two values
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Ridged fractional Brownian Motion noise.
 * Produces sharp V-shaped peaks and flat valleys — better for mountain surface detail.
 * Higher octaves are weighted by accumulated lower-frequency amplitude,
 * concentrating fine detail on top of existing peaks.
 * Returns values in [0, 1].
 */
export function ridgedFbmNoise(
  noise: ReturnType<typeof createNoise2D>,
  nx: number,
  ny: number,
  scale: number
): number {
  const ridge = (x: number, y: number): number => {
    const n = noise(x, y) / 2 + 0.5; // rescale -1..1 → 0..1
    return 2 * (0.5 - Math.abs(0.5 - n)); // V-shape peak at n=0.5
  };
  const e0 = ridge(scale * nx, scale * ny);
  const e1 = 0.5 * ridge(2 * scale * nx, 2 * scale * ny) * e0;
  const e2 = 0.25 * ridge(4 * scale * nx, 4 * scale * ny) * (e0 + e1);
  return (e0 + e1 + e2) / (1 + 0.5 + 0.25);
}

/**
 * FBM noise with configurable octave count
 */
export function fbmNoiseN(
  noise: ReturnType<typeof createNoise2D>,
  nx: number,
  ny: number,
  scale: number,
  octaves: number
): number {
  let sum = 0;
  let sumOfAmplitudes = 0;
  let amplitude = 0.5;

  for (let octave = 0; octave < octaves; octave++) {
    const frequency = (1 << octave) * scale;
    sum += amplitude * noise(nx * frequency, ny * frequency);
    sumOfAmplitudes += amplitude;
    amplitude *= 0.5;
  }

  return sumOfAmplitudes > 0 ? sum / sumOfAmplitudes : 0;
}

// ─── Island classification ───────────────────────────────────────────────────

const ISLAND_FBM_SCALE = 2.5;
const ISLAND_FBM_OCTAVES = 5;

/**
 * Classifies each Voronoi cell as land or water, then derives the ocean mask,
 * coastline, and BFS distance-to-coast in a single pass.
 *
 * Island shape formula (brashandplucky.com/2025/09/10/…):
 *   e = roughness · fBm(nx, ny) + island · (0.75 − 2·d²)
 * where d = Chebyshev distance from centre, normalized to [0,1].
 * A cell is land when e > 0.  `island` maps to k_d (falloff weight) and
 * `roughness` maps to k_fBm (noise weight) from the article.
 */
export function classifyIslandCells(
  centers: [number, number][],
  neighbors: number[][],
  noise: ReturnType<typeof createNoise2D>,
  island: number,
  roughness: number
): {
  isLand: boolean[];
  oceanMask: boolean[];
  isCoast: boolean[];
  distanceToCoast: number[];
} {
  const N = centers.length;

  // ── Land / water classification ────────────────────────────────────────────
  const isLand = new Array<boolean>(N);
  for (let i = 0; i < N; i++) {
    const [cx, cy] = centers[i];
    if (cx < 0.02 || cx > 0.98 || cy < 0.02 || cy > 0.98) {
      isLand[i] = false;
      continue;
    }
    const nx = cx - 0.5;
    const ny = cy - 0.5;
    const d = Math.max(Math.abs(nx), Math.abs(ny)) * 2;
    const fbm = fbmNoiseN(noise, nx, ny, ISLAND_FBM_SCALE, ISLAND_FBM_OCTAVES);
    isLand[i] = roughness * fbm + island * (0.75 - 2 * d * d) > 0;
  }

  // ── Ocean flood-fill (connected non-land from boundary) ───────────────────
  const oceanMask = new Array<boolean>(N).fill(false);
  const visited = new Array<boolean>(N).fill(false);
  const floodQueue: number[] = [];
  for (let i = 0; i < N; i++) {
    if (!isLand[i]) {
      floodQueue.push(i);
      visited[i] = true;
    }
  }
  let head = 0;
  while (head < floodQueue.length) {
    const c = floodQueue[head++];
    oceanMask[c] = true;
    for (const nb of neighbors[c]) {
      if (nb < 0 || nb >= N || visited[nb] || isLand[nb]) continue;
      visited[nb] = true;
      floodQueue.push(nb);
    }
  }

  // ── Coast: land cells adjacent to ocean or hull edge (-1 neighbor) ───────
  const isCoast = new Array<boolean>(N).fill(false);
  for (let i = 0; i < N; i++) {
    if (!isLand[i]) continue;
    for (const nb of neighbors[i]) {
      if (nb === -1 || (nb >= 0 && nb < N && oceanMask[nb])) {
        isCoast[i] = true;
        break;
      }
    }
  }

  // ── BFS distance-to-coast through land only ────────────────────────────────
  const distanceToCoast = new Array<number>(N).fill(Infinity);
  const dq: number[] = [];
  for (let i = 0; i < N; i++) {
    if (isCoast[i]) {
      distanceToCoast[i] = 0;
      dq.push(i);
    }
  }
  head = 0;
  while (head < dq.length) {
    const c = dq[head++];
    for (const nb of neighbors[c]) {
      if (nb < 0 || nb >= N || distanceToCoast[nb] !== Infinity || !isLand[nb]) continue;
      distanceToCoast[nb] = distanceToCoast[c] + 1;
      dq.push(nb);
    }
  }

  return { isLand, oceanMask, isCoast, distanceToCoast };
}

export function buildTerrainGraph(
  seed: number,
  r: number,
  k = 30
): {
  centers: [number, number][];
  vertices: [number, number][][];
  neighbors: number[][];
} {
  const prng = alea(seed, 'terrain');
  const cellSize = r / Math.SQRT2;
  const gridW = Math.ceil(1 / cellSize);
  const gridH = Math.ceil(1 / cellSize);
  const grid = new Int32Array(gridW * gridH).fill(-1);
  const pts: [number, number][] = [];
  const active: number[] = [];

  const nextHe = (e: number) => (e % 3 === 2 ? e - 2 : e + 1);
  const toCell = (v: number) => Math.floor(v / cellSize);
  const isValid = (x: number, y: number): boolean => {
    if (x < 0 || x >= 1 || y < 0 || y >= 1) return false;
    const gx = toCell(x);
    const gy = toCell(y);
    const x0 = Math.max(0, gx - 2);
    const x1 = Math.min(gridW - 1, gx + 2);
    const y0 = Math.max(0, gy - 2);
    const y1 = Math.min(gridH - 1, gy + 2);
    for (let iy = y0; iy <= y1; iy++) {
      for (let ix = x0; ix <= x1; ix++) {
        const idx = grid[iy * gridW + ix];
        if (idx === -1) continue;
        const dx = pts[idx][0] - x;
        const dy = pts[idx][1] - y;
        if (dx * dx + dy * dy < r * r) return false;
      }
    }
    return true;
  };

  const sx = prng();
  const sy = prng();
  pts.push([sx, sy]);
  active.push(0);
  grid[toCell(sy) * gridW + toCell(sx)] = 0;

  while (active.length > 0) {
    const i = Math.floor(prng() * active.length);
    const [ax, ay] = pts[active[i]];
    let found = false;

    for (let attempt = 0; attempt < k; attempt++) {
      const angle = prng() * 2 * Math.PI;
      const dist = r * (1 + prng());
      const cx = ax + Math.cos(angle) * dist;
      const cy = ay + Math.sin(angle) * dist;
      if (isValid(cx, cy)) {
        const idx = pts.length;
        pts.push([cx, cy]);
        active.push(idx);
        grid[toCell(cy) * gridW + toCell(cx)] = idx;
        found = true;
        break;
      }
    }

    if (!found) {
      active[i] = active[active.length - 1];
      active.pop();
    }
  }

  const C = 4;
  const N = pts.length;
  const M = C + N;

  const coords = new Float64Array(M * 2);
  coords.set([-0.1, -0.1, 1.1, -0.1, 1.1, 1.1, -0.1, 1.1]);
  for (let i = 0; i < N; i++) {
    coords[(C + i) * 2] = pts[i][0];
    coords[(C + i) * 2 + 1] = pts[i][1];
  }

  const del = new Delaunator(coords);
  const { triangles, halfedges } = del;
  const T = triangles.length / 3;

  const centroids: [number, number][] = new Array(T);
  for (let t = 0; t < T; t++) {
    const a = triangles[t * 3];
    const b = triangles[t * 3 + 1];
    const c = triangles[t * 3 + 2];
    centroids[t] = [
      (coords[a * 2] + coords[b * 2] + coords[c * 2]) / 3,
      (coords[a * 2 + 1] + coords[b * 2 + 1] + coords[c * 2 + 1]) / 3,
    ];
  }

  const inedges = new Int32Array(M).fill(-1);
  for (let e = 0; e < triangles.length; e++) {
    const p = triangles[nextHe(e)];
    if (p < M && (inedges[p] === -1 || halfedges[e] === -1)) inedges[p] = e;
  }

  const centers: [number, number][] = [];
  const vertices: [number, number][][] = [];
  const neighbors: number[][] = [];

  for (let i = 0; i < N; i++) {
    const gp = C + i;
    centers.push([coords[gp * 2], coords[gp * 2 + 1]]);

    const start = inedges[gp];
    if (start === -1) {
      vertices.push([]);
      neighbors.push([]);
      continue;
    }

    const cellVerts: [number, number][] = [];
    const cellNeighbors: number[] = [];
    let e = start;
    do {
      cellVerts.push(centroids[Math.floor(e / 3)]);
      const nb = triangles[e];
      cellNeighbors.push(nb >= C ? nb - C : -1);
      e = halfedges[nextHe(e)];
    } while (e !== -1 && e !== start);

    vertices.push(cellVerts);
    neighbors.push(cellNeighbors);
  }

  return { centers, vertices, neighbors };
}

// ─── Pipeline step 1: Build base graph ───────────────────────────────────────

const POISSON_RADIUS: Record<string, number> = {
  Tiny: 0.04,
  Small: 0.02,
  Medium: 0.01,
  Large: 0.006,
  Huge: 0.003,
};

/**
 * Samples the plane with Poisson-disk points, builds a Delaunay triangulation,
 * and returns the dual Voronoi cells as a flat array of TerrainCells.
 * Cell IDs are array indices (0..N-1) and remain stable for the entire pipeline.
 */
export function buildBaseGraph(seed: number, size: string): TerrainCell[] {
  const radius = POISSON_RADIUS[size] ?? POISSON_RADIUS['Medium'];
  const { centers, vertices, neighbors } = buildTerrainGraph(seed, radius);
  return centers.map((center, id) => ({
    id,
    center,
    vertices: vertices[id],
    neighbors: neighbors[id],
  }));
}

// ─── Pipeline step 2: Generate island shape ───────────────────────────────────

/**
 * Classifies every Voronoi cell as land or ocean, then returns only the land
 * cells as IslandCells — one entry per land cell, keyed by its original stable ID.
 * distanceToCoast = 0 identifies coast cells.  distanceToRidge and elevation are
 * left at their initial values (Infinity / 0) to be filled by later steps.
 * The full cells array is never mutated; IDs stay stable.
 */
export function generateIslandShape(
  cells: TerrainCell[],
  seed: number,
  island: number,
  roughness: number
): IslandCell[] {
  const noiseShape = createNoise2D(alea(seed, 'shape'));
  const centers = cells.map(c => c.center);
  const neighbors = cells.map(c => c.neighbors);

  const { isLand, distanceToCoast } = classifyIslandCells(
    centers,
    neighbors,
    noiseShape,
    island,
    roughness
  );

  const islandCells: IslandCell[] = [];
  for (let i = 0; i < cells.length; i++) {
    if (isLand[i]) {
      islandCells.push({
        id: cells[i].id,
        distanceToCoast: distanceToCoast[i],
        distanceToRidge: Infinity,
        elevation: 0,
      });
    }
  }
  return islandCells;
}

// ─── Pipeline step 3: Generate ridges ────────────────────────────────────────

/** Walk the neighbour graph staying close to a target depth contour. */
function walkSpine(
  cells: TerrainCell[],
  islandMap: Map<number, IslandCell>,
  startId: number,
  targetDepth: number,
  maxSteps: number,
  dirX: number,
  dirY: number,
  visited: Set<number>
): number[] {
  const W_CONTOUR = 0.65;
  const W_DIR = 0.35;
  const result: number[] = [];
  let curId = startId;
  let vx = dirX,
    vy = dirY;

  for (let step = 0; step < maxSteps; step++) {
    let bestId = -1;
    let bestScore = -Infinity;

    for (const nbId of cells[curId].neighbors) {
      if (nbId < 0 || nbId >= cells.length) continue;
      const nbIsland = islandMap.get(nbId);
      if (!nbIsland || visited.has(nbId)) continue;

      const depthScore = 1 - Math.abs(nbIsland.distanceToCoast - targetDepth) / (targetDepth + 1);
      const dx = cells[nbId].center[0] - cells[curId].center[0];
      const dy = cells[nbId].center[1] - cells[curId].center[1];
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const score = W_CONTOUR * depthScore + W_DIR * ((vx * dx + vy * dy) / len);

      if (score > bestScore) {
        bestScore = score;
        bestId = nbId;
      }
    }

    if (bestId === -1 || bestScore < -0.5) break;

    visited.add(bestId);
    result.push(bestId);

    const dx = cells[bestId].center[0] - cells[curId].center[0];
    const dy = cells[bestId].center[1] - cells[curId].center[1];
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    vx = 0.7 * vx + 0.3 * (dx / len);
    vy = 0.7 * vy + 0.3 * (dy / len);
    const vLen = Math.sqrt(vx * vx + vy * vy) || 1;
    vx /= vLen;
    vy /= vLen;
    curId = bestId;
  }

  return result;
}

/** Walk perpendicular to the spine axis to form a lateral spur. */
function walkSpur(
  cells: TerrainCell[],
  islandMap: Map<number, IslandCell>,
  startId: number,
  maxSteps: number,
  perpX: number,
  perpY: number,
  visited: Set<number>
): number[] {
  const result: number[] = [];
  let curId = startId;
  let vx = perpX,
    vy = perpY;

  for (let step = 0; step < maxSteps; step++) {
    let bestId = -1;
    let bestScore = -Infinity;

    for (const nbId of cells[curId].neighbors) {
      if (nbId < 0 || nbId >= cells.length) continue;
      const nbIsland = islandMap.get(nbId);
      const curIsland = islandMap.get(curId);
      if (!nbIsland || visited.has(nbId)) continue;

      const depthGain = nbIsland.distanceToCoast - (curIsland?.distanceToCoast ?? 0);
      const dx = cells[nbId].center[0] - cells[curId].center[0];
      const dy = cells[nbId].center[1] - cells[curId].center[1];
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const score = 0.6 * depthGain + 0.4 * ((vx * dx + vy * dy) / len);

      if (score > bestScore) {
        bestScore = score;
        bestId = nbId;
      }
    }

    if (bestId === -1 || bestScore < -0.3) break;

    visited.add(bestId);
    result.push(bestId);

    const dx = cells[bestId].center[0] - cells[curId].center[0];
    const dy = cells[bestId].center[1] - cells[curId].center[1];
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    vx = 0.7 * vx + 0.3 * (dx / len);
    vy = 0.7 * vy + 0.3 * (dy / len);
    const vLen = Math.sqrt(vx * vx + vy * vy) || 1;
    vx /= vLen;
    vy /= vLen;
    curId = bestId;
  }

  return result;
}

/**
 * Places mountain ridge spines on the island by walking the cell graph along a
 * target inland depth contour, then grows lateral spurs to control width.
 * Returns an array of ridge cell IDs.
 */
export function generateRidges(
  cells: TerrainCell[],
  islandCells: IslandCell[],
  ridgeCount: number,
  ridgeLength: number,
  ridgeWidth: number,
  inlandOffset: number,
  seed: number
): { id: number }[] {
  if (ridgeCount === 0) return [];

  const islandMap = new Map(islandCells.map(c => [c.id, c]));

  let maxDist = 0;
  for (const ic of islandCells) {
    if (ic.distanceToCoast !== Infinity && ic.distanceToCoast > maxDist)
      maxDist = ic.distanceToCoast;
  }
  const targetDepth = inlandOffset * maxDist;
  const depthTolerance = Math.max(2, maxDist * 0.15);

  const eligible = islandCells.filter(c => c.distanceToCoast >= 2);
  if (eligible.length === 0) return [];

  const seeds = eligible.filter(c => Math.abs(c.distanceToCoast - targetDepth) <= depthTolerance);
  const seedPool = seeds.length > 0 ? seeds : eligible;
  const minSeedSep = 1 / (ridgeCount + 1);

  const ridgeSet = new Set<number>();
  const globalVisited = new Set<number>();
  const placedSeeds: [number, number][] = [];

  const SPUR_FREQUENCY = 3;

  for (let ri = 0; ri < ridgeCount; ri++) {
    const prng = alea(seed, 'ridge', ri);
    const shuffled = seedPool.slice().sort(() => prng() - 0.5);

    let seedIsland: IslandCell | null = null;
    for (const candidate of shuffled) {
      const tooClose = placedSeeds.some(([sx, sy]) => {
        const dx = cells[candidate.id].center[0] - sx;
        const dy = cells[candidate.id].center[1] - sy;
        return dx * dx + dy * dy < minSeedSep * minSeedSep;
      });
      if (!tooClose && !globalVisited.has(candidate.id)) {
        seedIsland = candidate;
        break;
      }
    }
    if (!seedIsland) continue;

    const seedId = seedIsland.id;
    placedSeeds.push(cells[seedId].center);
    globalVisited.add(seedId);

    const angle = prng() * 2 * Math.PI;
    const halfLen = Math.floor(ridgeLength / 2);
    const spineVisited = new Set<number>([seedId]);

    const forward = walkSpine(
      cells,
      islandMap,
      seedId,
      targetDepth,
      halfLen,
      Math.cos(angle),
      Math.sin(angle),
      spineVisited
    );
    const backward = walkSpine(
      cells,
      islandMap,
      seedId,
      targetDepth,
      halfLen,
      -Math.cos(angle),
      -Math.sin(angle),
      spineVisited
    );
    const spineIds = [...backward.slice().reverse(), seedId, ...forward];

    for (const id of spineIds) {
      ridgeSet.add(id);
      globalVisited.add(id);
    }

    if (ridgeWidth > 0) {
      for (let si = 0; si < spineIds.length; si++) {
        if (si % SPUR_FREQUENCY !== 0) continue;

        const prevId = spineIds[Math.max(0, si - 1)];
        const nextId = spineIds[Math.min(spineIds.length - 1, si + 1)];
        const axisX = cells[nextId].center[0] - cells[prevId].center[0];
        const axisY = cells[nextId].center[1] - cells[prevId].center[1];
        const axisLen = Math.sqrt(axisX * axisX + axisY * axisY) || 1;

        const perps: [number, number][] = [
          [-axisY / axisLen, axisX / axisLen],
          [axisY / axisLen, -axisX / axisLen],
        ];

        const spurVisited = new Set<number>(globalVisited);
        for (const [px, py] of perps) {
          const spur = walkSpur(cells, islandMap, spineIds[si], ridgeWidth, px, py, spurVisited);
          for (const id of spur) {
            ridgeSet.add(id);
            globalVisited.add(id);
            spurVisited.add(id);
          }
          if (spur.length > 0) break;
        }
      }
    }
  }

  return Array.from(ridgeSet).map(id => ({ id }));
}

// ─── Pipeline step 4: Compute elevation ──────────────────────────────────────

/**
 * BFS-propagates distance from ridge cells through land, derives a 0–1 elevation
 * value per land cell, and applies FBM noise for surface roughness.
 * Mutates islandCells in place (fills distanceToRidge and elevation).
 */
export function computeTerrainElevation(
  cells: TerrainCell[],
  islandCells: IslandCell[],
  ridgeCells: { id: number }[],
  seed: number,
  elevationRoughness: number,
  elevationNoise: number
): void {
  const ELEVATION_REDISTRIBUTION = 1.6;
  const noiseElev = createNoise2D(alea(seed, 'elevation'));
  const islandMap = new Map(islandCells.map(c => [c.id, c]));
  const ridgeSet = new Set(ridgeCells.map(c => c.id));

  // BFS from all ridge cells through land only
  const queue: number[] = [];
  for (const ic of islandCells) {
    if (ridgeSet.has(ic.id)) {
      ic.distanceToRidge = 0;
      queue.push(ic.id);
    }
  }

  let head = 0;
  while (head < queue.length) {
    const curId = queue[head++];
    for (const nbId of cells[curId].neighbors) {
      if (nbId < 0 || nbId >= cells.length) continue;
      const nbIsland = islandMap.get(nbId);
      if (!nbIsland || nbIsland.distanceToRidge !== Infinity) continue;
      nbIsland.distanceToRidge = islandMap.get(curId)!.distanceToRidge + 1;
      queue.push(nbId);
    }
  }

  let maxDist = 0;
  for (const ic of islandCells) {
    if (ic.distanceToRidge !== Infinity) maxDist = Math.max(maxDist, ic.distanceToRidge);
  }
  if (maxDist === 0) maxDist = 1;

  for (const ic of islandCells) {
    const raw = ic.distanceToRidge === Infinity ? 0 : 1 - ic.distanceToRidge / maxDist;
    const fbm = ridgedFbmNoise(
      noiseElev,
      cells[ic.id].center[0] - 0.5,
      cells[ic.id].center[1] - 0.5,
      elevationNoise
    );
    ic.elevation = Math.max(
      0,
      Math.min(1, Math.pow(raw, ELEVATION_REDISTRIBUTION) + fbm * elevationRoughness)
    );
  }
}

const DEBUG_MODES = ['cell', 'island', 'ridges', 'elevation'] as const;
type DebugMode = (typeof DEBUG_MODES)[number];

const TERRAIN_BOUNDS = 100;

function cellIdColor(id: number): [number, number, number] {
  const hue = ((id * 137) % 360) / 360;
  const sector = Math.floor(hue * 6);
  const f = hue * 6 - sector;
  const q = 1 - f;
  switch (sector % 6) {
    case 0:
      return [255, Math.round(f * 255), 0];
    case 1:
      return [Math.round(q * 255), 255, 0];
    case 2:
      return [0, 255, Math.round(f * 255)];
    case 3:
      return [0, Math.round(q * 255), 255];
    case 4:
      return [Math.round(f * 255), 0, 255];
    default:
      return [255, 0, Math.round(q * 255)];
  }
}

function islandCellColor(
  ic: IslandCell,
  mode: DebugMode,
  isRidge: boolean
): [number, number, number] {
  switch (mode) {
    case 'island':
      return ic.distanceToCoast === 0 ? [220, 200, 80] : [80, 180, 80];
    case 'ridges':
      return isRidge ? [220, 50, 50] : [170, 150, 105];
    case 'elevation':
      return [
        Math.round(ic.elevation * 255),
        Math.round(ic.elevation * 255),
        Math.round(ic.elevation * 255),
      ];
    default:
      return [200, 200, 200];
  }
}

export function buildTerrainMesh(
  terrain: TerrainData,
  elevationScale: number,
  debugMode: string
): THREE.Object3D {
  const mode: DebugMode = (DEBUG_MODES as readonly string[]).includes(debugMode)
    ? (debugMode as DebugMode)
    : 'elevation';
  const { cells, islandCells, ridgeCells } = terrain;
  const ridgeSet = new Set(ridgeCells.map(c => c.id));
  const bounds = TERRAIN_BOUNDS;
  const STEPS = 15;

  const positions: number[] = [];
  const colors: number[] = [];

  const pushCell = (
    vv: number[][],
    cx: number,
    cy: number,
    cz: number,
    col: [number, number, number]
  ) => {
    if (vv.length < 2) return;
    const r = col[0] / 255,
      g = col[1] / 255,
      b = col[2] / 255;
    for (let i = 0; i < vv.length; i++) {
      const j = (i + 1) % vv.length;
      if (
        vv[i][0] < 0 ||
        vv[i][0] > 1 ||
        vv[i][1] < 0 ||
        vv[i][1] > 1 ||
        vv[j][0] < 0 ||
        vv[j][0] > 1 ||
        vv[j][1] < 0 ||
        vv[j][1] > 1
      )
        continue;
      positions.push(
        cx,
        cy,
        cz,
        (vv[i][0] - 0.5) * bounds,
        cy,
        (vv[i][1] - 0.5) * bounds,
        (vv[j][0] - 0.5) * bounds,
        cy,
        (vv[j][1] - 0.5) * bounds
      );
      colors.push(r, g, b, r, g, b, r, g, b);
    }
  };

  if (mode === 'cell') {
    for (const c of cells) {
      if (!c || c.vertices.length < 2) continue;
      const col = cellIdColor(c.id);
      const cx = (c.center[0] - 0.5) * bounds;
      const cz = (c.center[1] - 0.5) * bounds;
      pushCell(c.vertices, cx, 0, cz, col);
    }
  } else {
    for (const ic of islandCells) {
      const c = cells[ic.id];
      const col = islandCellColor(ic, mode, ridgeSet.has(ic.id));
      const cx = (c.center[0] - 0.5) * bounds;
      const cy =
        mode === 'elevation'
          ? (Math.round(ic.elevation * (STEPS - 1)) / (STEPS - 1)) * elevationScale
          : 0;
      const cz = (c.center[1] - 0.5) * bounds;
      pushCell(c.vertices, cx, cy, cz, col);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  return new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide })
  );
}
