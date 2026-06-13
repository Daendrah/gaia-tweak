import * as THREE from 'three';
import { getParameterValue } from '@/lib/world/parameters';
import { GenerationCommand, CommandStep } from '@/types/generationTypes';
import { ComponentBuilder } from '@/types/worldTypes';
import {
  findMoistureSeeds,
  assignMoistureRegions,
  redistributeMoisture,
  assignCoastRegions,
  assignTemperatureRegions,
  assignBiomeRegions,
  updateTerrainColors,
} from './biomes.algorithms';

const TERRAIN_MESH_NAME = 'terrainMesh';

export const biomesBuilder: ComponentBuilder = {
  generateCommand: (): GenerationCommand => {
    const steps: CommandStep[] = [
      {
        name: 'Find moisture seeds',
        execute: async context => {
          const mesh = context.generationData.mesh;
          const water_r = context.generationData.water_r;
          const ocean_r = context.generationData.ocean_r;
          const flow_s = context.generationData.flow_s;

          if (!mesh || !water_r || !ocean_r || !flow_s) {
            console.warn('Required water data not available. Generate water first.');
            return;
          }

          const moistureSeeds = await findMoistureSeeds(mesh, water_r, ocean_r, flow_s);
          context.generationData.moistureSeeds = moistureSeeds;
        },
      },
      {
        name: 'Calculate moisture distribution',
        execute: async context => {
          const mesh = context.generationData.mesh;
          const water_r = context.generationData.water_r;
          const moistureSeeds = context.generationData.moistureSeeds;

          if (!mesh || !water_r || !moistureSeeds) return;

          const { moisture_r, waterdistance_r } = await assignMoistureRegions(
            mesh,
            water_r,
            moistureSeeds
          );

          context.generationData.moisture_r = moisture_r;
          context.generationData.waterdistance_r = waterdistance_r;
        },
      },
      {
        name: 'Redistribute moisture',
        execute: async context => {
          const redistribute = getParameterValue(context.params, 'redistributeMoisture', true);

          if (!redistribute) return;

          const mesh = context.generationData.mesh;
          const water_r = context.generationData.water_r;
          const moisture_r = context.generationData.moisture_r;
          const moistureBias = getParameterValue(context.params, 'moistureBias', 0);
          const minMoisture = getParameterValue(context.params, 'minMoisture', 0);
          const maxMoisture = getParameterValue(context.params, 'maxMoisture', 1);

          if (!mesh || !water_r || !moisture_r) return;

          await redistributeMoisture(
            mesh,
            water_r,
            moisture_r,
            moistureBias,
            minMoisture,
            maxMoisture
          );
        },
      },
      {
        name: 'Identify coastal regions',
        execute: async context => {
          const mesh = context.generationData.mesh;
          const ocean_r = context.generationData.ocean_r;

          if (!mesh || !ocean_r) return;

          const coast_r = await assignCoastRegions(mesh, ocean_r);
          context.generationData.coast_r = coast_r;
        },
      },
      {
        name: 'Calculate temperature',
        execute: async context => {
          const mesh = context.generationData.mesh;
          const elevation_r = context.generationData.elevation_r;
          const northTemp = getParameterValue(context.params, 'northTemperature', 0);
          const southTemp = getParameterValue(context.params, 'southTemperature', 0);

          if (!mesh || !elevation_r) return;

          const temperature_r = await assignTemperatureRegions(
            mesh,
            elevation_r,
            northTemp,
            southTemp
          );

          context.generationData.temperature_r = temperature_r;
        },
      },
      {
        name: 'Assign biomes',
        execute: async context => {
          const mesh = context.generationData.mesh;
          const ocean_r = context.generationData.ocean_r;
          const water_r = context.generationData.water_r;
          const coast_r = context.generationData.coast_r;
          const temperature_r = context.generationData.temperature_r;
          const moisture_r = context.generationData.moisture_r;

          if (!mesh || !ocean_r || !water_r || !coast_r || !temperature_r || !moisture_r) {
            return;
          }

          const biome_r = await assignBiomeRegions(
            mesh,
            ocean_r,
            water_r,
            coast_r,
            temperature_r,
            moisture_r
          );

          context.generationData.biome_r = biome_r;
        },
      },
      {
        name: 'Update terrain colors',
        execute: async context => {
          const showBiomeColors = getParameterValue(context.params, 'showBiomeColors', true);

          if (!showBiomeColors) return;

          const terrainMesh = context.world.getObjectByName(TERRAIN_MESH_NAME);

          if (!terrainMesh) {
            console.warn('Terrain mesh not found. Generate terrain first.');
            return;
          }

          const mesh = context.generationData.mesh;
          const biome_r = context.generationData.biome_r;
          const water_r = context.generationData.water_r;

          if (!mesh || !biome_r || !water_r) return;

          await updateTerrainColors(terrainMesh, mesh, biome_r, water_r);
        },
      },
    ];

    return {
      componentKey: 'biomes',
      steps,
    };
  },

  cleanup: context => {
    // Reset terrain colors to default if needed
    const terrainMesh = context.world.getObjectByName(TERRAIN_MESH_NAME);
    if (terrainMesh && terrainMesh instanceof THREE.Mesh) {
      const geometry = terrainMesh.geometry;
      const colorAttr = geometry.getAttribute('color');
      if (colorAttr) {
        const defaultColor = new THREE.Color('#88aa55');
        const colors = colorAttr.array as Float32Array;
        for (let i = 0; i < colors.length; i += 3) {
          colors[i] = defaultColor.r;
          colors[i + 1] = defaultColor.g;
          colors[i + 2] = defaultColor.b;
        }
        colorAttr.needsUpdate = true;
      }
    }
  },
};
