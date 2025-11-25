import * as THREE from 'three';

import { BACKGROUND_FRAGMENT_SHADER } from '@/lib/world/components/skybox/assets/background.shaders';
import { COMMON_VERTEX_SHADER } from '@/lib/world/components/skybox/assets/common.shaders';
import { KUWAHARA_FRAGMENT_SHADER } from '@/lib/world/components/skybox/assets/kuwahara.shaders';
import { STARS_FRAGMENT_SHADER } from '@/lib/world/components/skybox/assets/stars.shaders';
import { getParameterValue } from '@/lib/world/parameters';
import { CommandStep, GenerationCommand } from '@/types/generationTypes';
import { ComponentBuilder } from '@/types/worldTypes';

export const skyboxBuilder: ComponentBuilder = {
  generateCommand: (): GenerationCommand => {
    const steps: CommandStep[] = [
      {
        name: 'Initializing skybox generation',
        execute: async context => {
          function createRenderTarget(resolution: number): THREE.WebGLCubeRenderTarget {
            return new THREE.WebGLCubeRenderTarget(resolution, {
              format: THREE.RGBAFormat,
              type: THREE.FloatType,
              colorSpace: THREE.SRGBColorSpace,
              minFilter: THREE.LinearFilter,
              magFilter: THREE.LinearFilter,
            });
          }

          resetSkybox(context.world);

          const resolution = parseInt(
            getParameterValue(context.params, 'resolution', '1024') as string
          );

          context.world.userData.procedural.skybox = {
            scene: new THREE.Scene(),
            renderTargets: {
              background: createRenderTarget(resolution),
              kuwahara: createRenderTarget(resolution),
              final: createRenderTarget(resolution),
            },
          };
        },
      },

      {
        name: 'Pass 1: Generating stylized background',
        execute: async context => {
          const skyboxData = context.world.userData.procedural.skybox;
          if (!skyboxData.scene || !skyboxData.renderTargets.background) {
            throw new Error('Skybox initialization incomplete');
          }

          if (!context.world.userData.renderer) {
            throw new Error('WebGL renderer not available');
          }

          const scene = skyboxData.scene;
          const cubeTarget = skyboxData.renderTargets.background;
          const cubeCamera = new THREE.CubeCamera(0.1, 10, cubeTarget);

          scene.clear();

          const hexToVec3 = (hex: string) => {
            const col = new THREE.Color(hex);
            return new THREE.Vector3(col.r, col.g, col.b);
          };

          const material = new THREE.ShaderMaterial({
            uniforms: {
              u_enabled: { value: getParameterValue(context.params, 'backgroundEnable', true) },
              u_backgroundColor: {
                value: hexToVec3(
                  getParameterValue(context.params, 'backgroundColor', '#0f3c66') as string
                ),
              },
              u_midColor: {
                value: hexToVec3(
                  getParameterValue(context.params, 'midColor', '#27598e') as string
                ),
              },
              u_horizonColor: {
                value: hexToVec3(
                  getParameterValue(context.params, 'horizonColor', '#a7927a') as string
                ),
              },
              u_noiseScale: { value: getParameterValue(context.params, 'noiseScale', 4.0) },
              u_noiseOctaves: { value: getParameterValue(context.params, 'noiseOctaves', 6) },
              u_posterizeSteps: {
                value: getParameterValue(context.params, 'posterizeSteps', 10.0),
              },
              u_gradientFalloffTop: {
                value: getParameterValue(context.params, 'gradientFalloffTop', 1.536),
              },
              u_gradientFalloffBottom: {
                value: getParameterValue(context.params, 'gradientFalloffBottom', 2.0),
              },
            },
            vertexShader: COMMON_VERTEX_SHADER,
            fragmentShader: BACKGROUND_FRAGMENT_SHADER,
            glslVersion: THREE.GLSL3,
          });

          const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
          mesh.geometry.scale(1, 1, -1);
          scene.add(mesh);

          cubeCamera.update(context.world.userData.renderer, scene);

          scene.remove(mesh);
          mesh.geometry.dispose();
          material.dispose();
        },
      },

      {
        name: 'Pass 2: Applying Kuwahara filter',
        execute: async context => {
          const skyboxData = context.world.userData.procedural.skybox;
          if (!skyboxData.scene || !skyboxData.renderTargets.kuwahara) {
            throw new Error('Skybox initialization incomplete');
          }

          if (!context.world.userData.renderer) {
            throw new Error('WebGL renderer not available');
          }

          const scene = skyboxData.scene;
          const cubeTarget = skyboxData.renderTargets.kuwahara;
          const cubeCamera = new THREE.CubeCamera(0.1, 10, cubeTarget);

          scene.clear();

          const material = new THREE.ShaderMaterial({
            uniforms: {
              u_enabled: { value: getParameterValue(context.params, 'kuwaharaEnable', true) },
              u_backgroundTexture: { value: skyboxData.renderTargets.background.texture },
              u_filterRadius: { value: getParameterValue(context.params, 'filterRadius', 12.0) },
              u_sampleOffset: { value: getParameterValue(context.params, 'sampleOffset', 0.002) },
            },
            vertexShader: COMMON_VERTEX_SHADER,
            fragmentShader: KUWAHARA_FRAGMENT_SHADER,
            glslVersion: THREE.GLSL3,
          });

          const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
          mesh.geometry.scale(1, 1, -1);
          scene.add(mesh);

          cubeCamera.update(context.world.userData.renderer, scene);

          scene.remove(mesh);
          mesh.geometry.dispose();
          material.dispose();
        },
      },

      {
        name: 'Pass 3: Generating star field',
        execute: async context => {
          const skyboxData = context.world.userData.procedural.skybox;
          if (!skyboxData.scene || !skyboxData.renderTargets.final) {
            throw new Error('Skybox initialization incomplete');
          }

          if (!context.world.userData.renderer) {
            throw new Error('WebGL renderer not available');
          }

          const scene = skyboxData.scene;
          const cubeTarget = skyboxData.renderTargets.final;
          const cubeCamera = new THREE.CubeCamera(0.1, 10, cubeTarget);

          scene.clear();

          const kuwaharaEnable = getParameterValue(context.params, 'kuwaharaEnable', true);

          const hexToVec3 = (hex: string) => {
            const col = new THREE.Color(hex);
            return new THREE.Vector3(col.r, col.g, col.b);
          };

          const material = new THREE.ShaderMaterial({
            uniforms: {
              u_enabled: { value: getParameterValue(context.params, 'starsEnable', true) },
              u_backgroundTexture: {
                value: kuwaharaEnable
                  ? skyboxData.renderTargets.kuwahara.texture
                  : skyboxData.renderTargets.background.texture,
              },
              u_starsDensity: { value: getParameterValue(context.params, 'starsDensity', 0.8) },
              u_starsGridScale: {
                value: getParameterValue(context.params, 'starsGridScale', 20.0),
              },
              u_starSizeBase: { value: getParameterValue(context.params, 'starSizeBase', 0.02) },
              u_starSizeVariation: {
                value: getParameterValue(context.params, 'starSizeVariation', 0.03),
              },
              u_starColor: {
                value: hexToVec3(
                  getParameterValue(context.params, 'starColor', '#ffffff') as string
                ),
              },
              u_starColorVariation: {
                value: getParameterValue(context.params, 'starColorVariation', 0.4),
              },
              u_horizonColor: {
                value: hexToVec3(
                  getParameterValue(context.params, 'horizonColor', '#a7927a') as string
                ),
              },
            },
            vertexShader: COMMON_VERTEX_SHADER,
            fragmentShader: STARS_FRAGMENT_SHADER,
            glslVersion: THREE.GLSL3,
          });

          const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
          mesh.geometry.scale(1, 1, -1);
          scene.add(mesh);

          cubeCamera.update(context.world.userData.renderer, scene);

          scene.remove(mesh);
          mesh.geometry.dispose();
          material.dispose();
        },
      },

      {
        name: 'Applying skybox to scene',
        execute: async context => {
          context.world.background =
            context.world.userData.procedural.skybox.renderTargets.final.texture;
        },
      },

      {
        name: 'Finalization',
        execute: async context => {
          if (!context.world.background) {
            throw new Error('Skybox application failed');
          }
        },
      },
    ];

    return {
      componentName: 'Skybox',
      steps,
    };
  },

  reset: (world: THREE.Scene): void => {
    resetSkybox(world);
  },

  isActive: (world: THREE.Scene): boolean => {
    return !!world.background && !!world.userData.procedural?.skybox;
  },
};

const resetSkybox = (world: THREE.Scene): void => {
  world.background = null;

  if (!world.userData.procedural?.skybox) return;

  const skyboxData = world.userData.procedural.skybox;

  if (skyboxData.scene) {
    skyboxData.scene.clear();
    skyboxData.scene = null;
  }

  const targets = skyboxData.renderTargets;
  if (targets) {
    if (targets.background) targets.background.dispose();
    if (targets.kuwahara) targets.kuwahara.dispose();
    if (targets.final) targets.final.dispose();
    delete skyboxData.renderTargets;
  }

  delete world.userData.procedural.skybox;
};
