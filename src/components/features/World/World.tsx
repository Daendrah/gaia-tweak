'use client';

import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import { MetricsMonitor } from '@/components/features/MetricsOverlay/MetricsMonitor';
import { PostProcessing } from '@/components/features/World/PostProcessing';
import { useWorldStore } from '@/store/worldStore';

export function World() {
  const { setWorld } = useWorldStore();

  return (
    <Canvas
      frameloop="always"
      shadows="soft"
      camera={{
        fov: 50,
        near: 0.1,
        far: 1000,
        position: [161.09497679328308, 57.617197762841045, 19.56047156938446],
      }}
      onCreated={({ scene, gl }) => {
        scene.userData.renderer = gl;
        scene.userData.procedural = {
          scene: new THREE.Scene(),
        };
        setWorld(scene);
      }}
    >
      <MetricsMonitor />
      <ambientLight intensity={0.6} />
      <OrbitControls />
      {/* <PostProcessing /> */}
      <gridHelper args={[100, 100]} position={[0, 0, 0]} />
    </Canvas>
  );
}
