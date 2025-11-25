'use client';

import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import { MetricsMonitor } from '@/components/features/MetricsOverlay/MetricsMonitor';
import { useWorldStore } from '@/store/worldStore';

export function World() {
  const { setWorld } = useWorldStore();

  return (
    <Canvas
      frameloop="always"
      shadows="soft"
      onCreated={({ scene, gl }) => {
        scene.userData.renderer = gl;
        scene.userData.procedural = {};
        setWorld(scene);
      }}
    >
      <color attach="background" args={['#0076a5']} />
      <MetricsMonitor />
      <ambientLight intensity={0.6} />
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color={'#aaaaaa'} />
      </mesh>
      <OrbitControls />
    </Canvas>
  );
}
