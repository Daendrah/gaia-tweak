import * as THREE from 'three';

import {
  SUN_FRAGMENT_SHADER,
  SUN_VERTEX_SHADER,
} from '@/lib/world/components/lighting/assets/sun.shaders';
import { getParameterValue } from '@/lib/world/parameters';
import { GenerationCommand, CommandStep } from '@/types/generationTypes';
import { ComponentBuilder } from '@/types/worldTypes';

const SUN_LIGHT_NAME = 'sunLight';
const SUN_MESH_NAME = 'sunMesh';

export const lightingBuilder: ComponentBuilder = {
  generateCommand: (): GenerationCommand => {
    const steps: CommandStep[] = [
      {
        name: 'Initialize lighting objects',
        execute: async context => {
          let light = context.world.getObjectByName(SUN_LIGHT_NAME) as THREE.DirectionalLight;
          let mesh = context.world.getObjectByName(SUN_MESH_NAME) as THREE.Mesh;

          if (!light || !mesh) {
            const sunObjects = createSunObjects(context.world);
            light = sunObjects.light;
            mesh = sunObjects.mesh;
          }
        },
      },
      {
        name: 'Update sun position',
        execute: async context => {
          const light = context.world.getObjectByName(SUN_LIGHT_NAME) as THREE.DirectionalLight;
          const mesh = context.world.getObjectByName(SUN_MESH_NAME) as THREE.Mesh;
          if (!light || !mesh) return;

          const sunAngle = getParameterValue(context.params, 'sunAngle', 50);
          const sunDistance = getParameterValue(context.params, 'sunDistance', 100);
          const angleRad = (sunAngle / 180) * Math.PI;

          const x = 0;
          const y = Math.cos(angleRad) * sunDistance;
          const z = -Math.sin(angleRad) * sunDistance;

          light.position.set(x, y, z);
          mesh.position.set(x, y, z);
        },
      },
      {
        name: 'Update light properties',
        execute: async context => {
          const light = context.world.getObjectByName(SUN_LIGHT_NAME) as THREE.DirectionalLight;
          if (!light) return;

          const sunLightColor = getParameterValue(context.params, 'sunLightColor', '#ffffdc');
          const sunIntensity = getParameterValue(context.params, 'sunIntensity', 0.9);

          const color = new THREE.Color(sunLightColor);
          light.color.setRGB(color.r, color.g, color.b);
          light.intensity = sunIntensity;
        },
      },
      {
        name: 'Update shadow configuration',
        execute: async context => {
          const light = context.world.getObjectByName(SUN_LIGHT_NAME) as THREE.DirectionalLight;
          if (!light) return;

          const castShadows = getParameterValue(context.params, 'castShadows', true);
          light.castShadow = castShadows;

          if (castShadows) {
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
            light.shadow.camera.far = 500;

            const shadowDistance = getParameterValue(context.params, 'shadowDistance', 200);
            light.shadow.camera.left = -shadowDistance;
            light.shadow.camera.right = shadowDistance;
            light.shadow.camera.top = shadowDistance;
            light.shadow.camera.bottom = -shadowDistance;

            light.shadow.bias = -0.0005;
            light.shadow.normalBias = 0.05;

            const shadowRadius = getParameterValue(context.params, 'shadowRadius', 1.5);
            const shadowBlurSamples = getParameterValue(context.params, 'shadowBlurSamples', 8);
            light.shadow.radius = shadowRadius;
            light.shadow.blurSamples = shadowBlurSamples;
          }
        },
      },
      {
        name: 'Update sun visual properties',
        execute: async context => {
          const mesh = context.world.getObjectByName(SUN_MESH_NAME) as THREE.Mesh;
          if (!mesh) return;

          const sunSize = getParameterValue(context.params, 'sunSize', 7);
          const geometry = mesh.geometry as THREE.SphereGeometry;

          // Only recreate geometry if size changed
          if (geometry.parameters.radius !== sunSize) {
            mesh.geometry.dispose();
            mesh.geometry = new THREE.SphereGeometry(sunSize, 64, 64);
          }

          // Update shader uniforms
          const material = mesh.material as THREE.ShaderMaterial;
          const sunInnerColor = getParameterValue(context.params, 'sunInnerColor', '#ff8800');
          const sunOuterColor = getParameterValue(context.params, 'sunOuterColor', '#ffbc05');
          const sunEdgePower = getParameterValue(context.params, 'sunEdgePower', 2.0);
          const sunIntensity = getParameterValue(context.params, 'sunIntensity', 0.9);

          const innerColor = new THREE.Color(sunInnerColor);
          const outerColor = new THREE.Color(sunOuterColor);

          material.uniforms['u_innerColor'].value.setRGB(innerColor.r, innerColor.g, innerColor.b);
          material.uniforms['u_outerColor'].value.setRGB(outerColor.r, outerColor.g, outerColor.b);
          material.uniforms['u_edgePower'].value = sunEdgePower;
          material.uniforms['u_intensity'].value = sunIntensity;
          material.needsUpdate = true;
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

const createSunObjects = (
  world: THREE.Scene
): { light: THREE.DirectionalLight; mesh: THREE.Mesh } => {
  // Create directional light
  const light = new THREE.DirectionalLight(0xffffff, 0.9);
  light.position.set(100, 80, 50);
  light.castShadow = true;
  light.name = SUN_LIGHT_NAME;

  // Initialize shadow settings
  light.shadow.mapSize.width = 4096;
  light.shadow.mapSize.height = 4096;
  light.shadow.camera.near = 1;
  light.shadow.camera.far = 500;
  light.shadow.camera.left = -200;
  light.shadow.camera.right = 200;
  light.shadow.camera.top = 200;
  light.shadow.camera.bottom = -200;
  light.shadow.bias = -0.0005;
  light.shadow.normalBias = 0.05;
  light.shadow.radius = 1.5;
  light.shadow.blurSamples = 8;

  world.add(light);

  // Create sun visual mesh
  const geometry = new THREE.SphereGeometry(7, 64, 64);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      u_innerColor: { value: new THREE.Color('#ff8800') },
      u_outerColor: { value: new THREE.Color('#ffbc05') },
      u_edgePower: { value: 2.0 },
      u_intensity: { value: 0.9 },
    },
    vertexShader: SUN_VERTEX_SHADER,
    fragmentShader: SUN_FRAGMENT_SHADER,
    transparent: false,
    depthWrite: false,
    glslVersion: THREE.GLSL3,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(light.position);
  mesh.name = SUN_MESH_NAME;

  world.add(mesh);

  return { light, mesh };
};

const resetLighting = (world: THREE.Scene): void => {
  const existingLight = world.getObjectByName(SUN_LIGHT_NAME) as THREE.DirectionalLight | null;
  if (existingLight) {
    world.remove(existingLight);
    existingLight.dispose?.();
  }

  const existingMesh = world.getObjectByName(SUN_MESH_NAME) as THREE.Mesh | null;
  if (existingMesh) {
    world.remove(existingMesh);
    existingMesh.geometry.dispose();
    if (Array.isArray(existingMesh.material)) {
      existingMesh.material.forEach(mat => mat.dispose());
    } else {
      existingMesh.material.dispose();
    }
  }

  // Clean up postprocessing data
  if (world.userData.procedural?.postprocessing) {
    delete world.userData.procedural.postprocessing;
  }
};
