'use client';

import { useThree, useFrame } from '@react-three/fiber';
import { EffectComposer, BloomEffect, EffectPass, RenderPass } from 'postprocessing';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export function PostProcessing() {
  const { gl, scene, camera, size } = useThree();
  const composerRef = useRef<EffectComposer | null>(null);
  const bloomEffectRef = useRef<BloomEffect | null>(null);

  useEffect(() => {
    const composer = new EffectComposer(gl, {
      frameBufferType: gl.capabilities.isWebGL2 ? THREE.HalfFloatType : undefined,
    });

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomEffect = new BloomEffect({
      mipmapBlur: true,
      luminanceThreshold: 0.0,
      radius: 0.8,
      intensity: 1.2,
    });

    composer.addPass(new EffectPass(camera, bloomEffect));

    composerRef.current = composer;
    bloomEffectRef.current = bloomEffect;

    return () => {
      composer.dispose();
      bloomEffect.dispose();
    };
  }, [gl, scene, camera]);

  useEffect(() => {
    composerRef.current?.setSize(size.width, size.height, false);
  }, [size]);

  useFrame(() => {
    if (composerRef.current) {
      composerRef.current.render();
    }
  }, 1);

  return null;
}
