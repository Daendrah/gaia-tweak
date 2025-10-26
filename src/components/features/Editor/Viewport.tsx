'use client';

import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import DiagnosticsMonitor from '@/components/features/Diagnostics/DiagnosticsMonitor';
import { useRegisterComponents } from '@/hooks/useRegisterComponents';
import { useWorldStore } from '@/store/worldStore';

export default function Viewport() {
  const { setWorld } = useWorldStore();

  useRegisterComponents();

  return (
    <Canvas
      className="viewport-canvas"
      frameloop="always"
      shadows="soft"
      onCreated={({ scene }) => {
        setWorld(scene);
      }}
    >
      <color attach="background" args={['#202020']} />
      <DiagnosticsMonitor />
      <ambientLight intensity={0.3} />
      <directionalLight intensity={0.3} />

      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color={'#4f8cff'} />
      </mesh>
      <OrbitControls />
    </Canvas>
  );
}
