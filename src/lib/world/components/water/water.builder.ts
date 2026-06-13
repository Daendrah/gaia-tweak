import * as THREE from 'three';
import { getParameterValue } from '@/lib/world/parameters';
import { GenerationCommand, CommandStep } from '@/types/generationTypes';
import { ComponentBuilder } from '@/types/worldTypes';
import {
  findRiverSprings,
  assignRiverFlow,
  createOceanMesh,
  createLakeMeshes,
  createRiverMeshes,
} from './water.algorithms';

const OCEAN_MESH_NAME = 'oceanMesh';
const LAKES_GROUP_NAME = 'lakesGroup';
const RIVERS_GROUP_NAME = 'riversGroup';

export const waterBuilder: ComponentBuilder = {
  generateCommand: (): GenerationCommand => {
    const steps: CommandStep[] = [
      {
        name: 'Find river springs',
        execute: async context => {
          // Get terrain data from previous component
          const mesh = context.generationData.mesh;
          const water_r = context.generationData.water_r;
          const elevation_t = context.generationData.elevation_t;

          if (!mesh || !water_r || !elevation_t) {
            console.warn('Terrain data not available. Generate terrain first.');
            return;
          }

          const t_spring = await findRiverSprings(mesh, water_r, elevation_t);
          context.generationData.t_spring = t_spring;
        },
      },
      {
        name: 'Calculate river flow',
        execute: async context => {
          const mesh = context.generationData.mesh;
          const t_spring = context.generationData.t_spring;
          const s_downslope_t = context.generationData.s_downslope_t;
          const numRivers = getParameterValue(context.params, 'numRivers', 30);
          const seed = getParameterValue(context.params, 'seed', 12345);

          if (!mesh || !t_spring || !s_downslope_t) {
            return;
          }

          const { t_river, flow_s } = await assignRiverFlow(
            mesh,
            t_spring,
            s_downslope_t,
            numRivers,
            seed
          );

          context.generationData.t_river = t_river;
          context.generationData.flow_s = flow_s;
        },
      },
      {
        name: 'Create ocean mesh',
        execute: async context => {
          const showOcean = getParameterValue(context.params, 'showOcean', true);

          if (!showOcean) return;

          const mesh = context.generationData.mesh;
          const ocean_r = context.generationData.ocean_r;
          const oceanLevel = getParameterValue(context.params, 'oceanLevel', 0);
          const oceanColor = getParameterValue(context.params, 'oceanColor', '#44447a');
          const oceanOpacity = getParameterValue(context.params, 'oceanOpacity', 0.8);
          const reflectivity = getParameterValue(context.params, 'waterReflectivity', 0.5);

          if (!mesh || !ocean_r) return;

          // Remove old ocean mesh
          const oldOcean = context.world.getObjectByName(OCEAN_MESH_NAME);
          if (oldOcean) {
            context.world.remove(oldOcean);
            if (oldOcean instanceof THREE.Mesh) {
              oldOcean.geometry.dispose();
              if (Array.isArray(oldOcean.material)) {
                oldOcean.material.forEach(m => m.dispose());
              } else {
                oldOcean.material.dispose();
              }
            }
          }

          const oceanMesh = await createOceanMesh(
            mesh,
            ocean_r,
            oceanLevel,
            oceanColor,
            oceanOpacity,
            reflectivity
          );

          oceanMesh.name = OCEAN_MESH_NAME;
          context.world.add(oceanMesh);
        },
      },
      {
        name: 'Create lake meshes',
        execute: async context => {
          const showLakes = getParameterValue(context.params, 'showLakes', true);

          if (!showLakes) return;

          const mesh = context.generationData.mesh;
          const water_r = context.generationData.water_r;
          const ocean_r = context.generationData.ocean_r;
          const elevation_r = context.generationData.elevation_r;
          const lakeColor = getParameterValue(context.params, 'lakeColor', '#336699');
          const lakeOpacity = getParameterValue(context.params, 'lakeOpacity', 0.7);
          const reflectivity = getParameterValue(context.params, 'waterReflectivity', 0.5);

          if (!mesh || !water_r || !ocean_r || !elevation_r) return;

          // Remove old lakes
          const oldLakes = context.world.getObjectByName(LAKES_GROUP_NAME);
          if (oldLakes) {
            context.world.remove(oldLakes);
            oldLakes.traverse(child => {
              if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                if (Array.isArray(child.material)) {
                  child.material.forEach(m => m.dispose());
                } else {
                  child.material.dispose();
                }
              }
            });
          }

          const lakesGroup = await createLakeMeshes(
            mesh,
            water_r,
            ocean_r,
            elevation_r,
            lakeColor,
            lakeOpacity,
            reflectivity
          );

          lakesGroup.name = LAKES_GROUP_NAME;
          context.world.add(lakesGroup);
        },
      },
      {
        name: 'Create river meshes',
        execute: async context => {
          const showRivers = getParameterValue(context.params, 'showRivers', true);

          if (!showRivers) return;

          const mesh = context.generationData.mesh;
          const flow_s = context.generationData.flow_s;
          const elevation_r = context.generationData.elevation_r;
          const riverColor = getParameterValue(context.params, 'riverColor', '#225588');
          const riverWidth = getParameterValue(context.params, 'riverWidth', 2);

          if (!mesh || !flow_s || !elevation_r) return;

          // Remove old rivers
          const oldRivers = context.world.getObjectByName(RIVERS_GROUP_NAME);
          if (oldRivers) {
            context.world.remove(oldRivers);
            oldRivers.traverse(child => {
              if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                if (Array.isArray(child.material)) {
                  child.material.forEach(m => m.dispose());
                } else {
                  child.material.dispose();
                }
              }
            });
          }

          const riversGroup = await createRiverMeshes(
            mesh,
            flow_s,
            elevation_r,
            riverColor,
            riverWidth
          );

          riversGroup.name = RIVERS_GROUP_NAME;
          context.world.add(riversGroup);
        },
      },
    ];

    return {
      componentKey: 'water',
      steps,
    };
  },

  cleanup: context => {
    const ocean = context.world.getObjectByName(OCEAN_MESH_NAME);
    const lakes = context.world.getObjectByName(LAKES_GROUP_NAME);
    const rivers = context.world.getObjectByName(RIVERS_GROUP_NAME);

    [ocean, lakes, rivers].forEach(obj => {
      if (obj) {
        context.world.remove(obj);
        obj.traverse(child => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach(m => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      }
    });
  },
};
