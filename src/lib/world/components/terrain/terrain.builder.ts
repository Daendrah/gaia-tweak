import { getParameterValue } from '@/lib/world/parameters';
import { CommandStep, GenerationCommand } from '@/types/generationTypes';
import { ComponentBuilder } from '@/types/worldTypes';
import * as THREE from 'three';
import {
  TerrainData,
  buildBaseGraph,
  buildTerrainMesh,
  computeTerrainElevation,
  generateIslandShape,
  generateRidges,
} from './terrain.algorithms';

const TERRAIN_MESH_NAME = 'terrainMesh';

function removeMesh(world: THREE.Scene): void {
  const obj = world.getObjectByName(TERRAIN_MESH_NAME);
  if (!obj) return;
  world.remove(obj);
  if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
    obj.geometry.dispose();
    (obj.material as THREE.Material).dispose();
  }
}

export const terrainBuilder: ComponentBuilder = {
  generateCommand: (): GenerationCommand => {
    const steps: CommandStep[] = [
      {
        name: 'Build terrain graph',
        execute: async context => {
          terrainBuilder.reset(context.world);

          context.world.userData.procedural.terrain = {} as TerrainData;
          const terrain = context.world.userData.procedural.terrain;
          const seed = getParameterValue(context.params, 'seed', 12345);
          const size = getParameterValue(context.params, 'size', 'Medium');

          terrain.cells = buildBaseGraph(seed, size);
          terrain.islandCells = [];
          terrain.ridgeCells = [];
        },
      },

      {
        name: 'Generate island shape',
        execute: async context => {
          const terrain = context.world.userData.procedural.terrain;
          const seed = getParameterValue(context.params, 'seed', 12345);
          const island = getParameterValue(context.params, 'island', 0.7);
          const roughness = getParameterValue(context.params, 'roughness', 0.7);

          terrain.islandCells = generateIslandShape(terrain.cells, seed, island, roughness);
          terrain.ridgeCells = [];
        },
      },

      {
        name: 'Generate ridges',
        execute: async context => {
          const terrain = context.world.userData.procedural.terrain;
          const seed = getParameterValue(context.params, 'seed', 12345);
          const ridgeCount = getParameterValue(context.params, 'ridgeCount', 2);
          const ridgeLength = getParameterValue(context.params, 'ridgeLength', 40);
          const ridgeWidth = getParameterValue(context.params, 'ridgeWidth', 6);
          const inlandOffset = getParameterValue(context.params, 'inlandOffset', 0.55);

          terrain.ridgeCells = generateRidges(
            terrain.cells,
            terrain.islandCells,
            ridgeCount,
            ridgeLength,
            ridgeWidth,
            inlandOffset,
            seed
          );
        },
      },

      {
        name: 'Compute elevation',
        execute: async context => {
          const terrain = context.world.userData.procedural.terrain;
          const seed = getParameterValue(context.params, 'seed', 12345);
          const elevationRoughness = getParameterValue(context.params, 'elevationRoughness', 0.15);
          const elevationNoise = getParameterValue(context.params, 'elevationNoise', 1.5);

          computeTerrainElevation(
            terrain.cells,
            terrain.islandCells,
            terrain.ridgeCells,
            seed,
            elevationRoughness,
            elevationNoise
          );
        },
      },

      {
        name: 'Build mesh',
        execute: async context => {
          const terrain = context.world.userData.procedural.terrain;
          const elevationScale = getParameterValue(context.params, 'elevationScale', 15);
          const debugMode = getParameterValue(context.params, 'debugMode', 'elevation');

          removeMesh(context.world);
          const mesh = buildTerrainMesh(terrain, elevationScale, debugMode);
          mesh.name = TERRAIN_MESH_NAME;
          context.world.add(mesh);
        },
      },
    ];

    return { componentName: 'terrain', steps };
  },

  reset: (world: THREE.Scene): void => {
    removeMesh(world);
  },

  isActive: (world: THREE.Scene): boolean => {
    return world.getObjectByName(TERRAIN_MESH_NAME) !== undefined;
  },
};
