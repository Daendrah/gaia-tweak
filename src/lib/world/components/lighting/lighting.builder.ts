import * as THREE from 'three';

import {
  SUN_FRAGMENT_SHADER,
  SUN_VERTEX_SHADER,
} from '@/lib/world/components/lighting/assets/sunShaders';
import { getParameterValue } from '@/lib/world/parameters';
import { GenerationCommand, CommandStep } from '@/types/generationTypes';
import { ComponentBuilder } from '@/types/worldTypes';

const SUN_LIGHT_NAME = 'sunLight';
const SUN_MESH_NAME = 'sunMesh';

export const lightingBuilder: ComponentBuilder = {
  generateCommand: (): GenerationCommand => {
    const steps: CommandStep[] = [
      {
        name: 'Cleaning existing lighting',
        execute: async context => {
          await new Promise(resolve => setTimeout(resolve, 2000));
          resetLighting(context.world);
        },
      },
      {
        name: 'Creating directional light',
        execute: async context => {
          await new Promise(resolve => setTimeout(resolve, 2000));
          const sunLightColor = getParameterValue(context.params, 'sunLightColor', '#ffffdc');
          const sunIntensity = getParameterValue(context.params, 'sunIntensity', 0.9);

          const light = new THREE.DirectionalLight(new THREE.Color(sunLightColor), sunIntensity);

          const sunAngle = getParameterValue(context.params, 'sunAngle', 50);
          const sunDistance = getParameterValue(context.params, 'sunDistance', 100);
          const angleRad = (sunAngle / 180) * Math.PI;

          light.position.set(
            0,
            Math.cos(angleRad) * sunDistance,
            -Math.sin(angleRad) * sunDistance
          );

          light.name = SUN_LIGHT_NAME;
          context.world.add(light);
        },
      },
      {
        name: 'Configuring shadow system',
        execute: async context => {
          await new Promise(resolve => setTimeout(resolve, 2000));
          const light = context.world.getObjectByName(SUN_LIGHT_NAME) as THREE.DirectionalLight;
          if (!light) return;

          const castShadows = getParameterValue(context.params, 'castShadows', true);
          if (castShadows) {
            light.castShadow = true;

            const shadowSizes = {
              low: 512,
              medium: 1024,
              high: 2048,
              ultra: 4096,
            };
            const shadowQuality = getParameterValue(context.params, 'shadowQuality', 'high');
            const shadowSize = shadowSizes[shadowQuality as keyof typeof shadowSizes] || 2048;

            light.shadow.mapSize.width = shadowSize;
            light.shadow.mapSize.height = shadowSize;
            light.shadow.camera.near = 1;
            light.shadow.camera.far = 300;
            light.shadow.camera.left = -50;
            light.shadow.camera.right = 50;
            light.shadow.camera.top = 50;
            light.shadow.camera.bottom = -50;
            light.shadow.bias = -0.0005;
            light.shadow.normalBias = 0.05;
          }
        },
      },
      {
        name: 'Creating sun visual mesh',
        execute: async context => {
          await new Promise(resolve => setTimeout(resolve, 2000));
          const light = context.world.getObjectByName(SUN_LIGHT_NAME) as THREE.DirectionalLight;
          if (!light) return;

          const sunSize = getParameterValue(context.params, 'sunSize', 7);
          const geometry = new THREE.SphereGeometry(sunSize, 64, 64);

          const sunInnerColor = getParameterValue(context.params, 'sunInnerColor', '#ff8800');
          const sunOuterColor = getParameterValue(context.params, 'sunOuterColor', '#ffbc05');
          const sunEdgePower = getParameterValue(context.params, 'sunEdgePower', 2.0);
          const sunIntensity = getParameterValue(context.params, 'sunIntensity', 0.9);

          const material = new THREE.ShaderMaterial({
            uniforms: {
              u_innerColor: { value: new THREE.Color(sunInnerColor) },
              u_outerColor: { value: new THREE.Color(sunOuterColor) },
              u_edgePower: { value: sunEdgePower },
              u_intensity: { value: sunIntensity },
            },
            vertexShader: SUN_VERTEX_SHADER,
            fragmentShader: SUN_FRAGMENT_SHADER,
            transparent: true,
            depthWrite: false,
          });

          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.copy(light.position);
          mesh.name = SUN_MESH_NAME;

          context.world.add(mesh);
        },
      },
      {
        name: 'Finalizing lighting setup',
        execute: async context => {
          await new Promise(resolve => setTimeout(resolve, 2000));
          const light = context.world.getObjectByName(SUN_LIGHT_NAME);
          const mesh = context.world.getObjectByName(SUN_MESH_NAME);

          if (!light || !mesh) {
            throw new Error('Lighting setup incomplete: missing light or sun mesh');
          }
        },
      },
    ];

    return {
      componentName: 'Lighting',
      steps,
    };
  },

  reset: (world: THREE.Scene): void => {
    resetLighting(world);
  },

  isActive: (world: THREE.Scene): boolean => {
    return world.getObjectByName(SUN_LIGHT_NAME) !== undefined;
  },
};

const resetLighting = (world: THREE.Scene): void => {
  const existingLight = world.getObjectByName(SUN_LIGHT_NAME);
  if (existingLight) {
    world.remove(existingLight);
  }

  const existingMesh = world.getObjectByName(SUN_MESH_NAME);
  if (existingMesh) {
    world.remove(existingMesh);
    if (existingMesh instanceof THREE.Mesh) {
      existingMesh.geometry.dispose();
      if (existingMesh.material instanceof THREE.Material) {
        existingMesh.material.dispose();
      }
    }
  }
};
