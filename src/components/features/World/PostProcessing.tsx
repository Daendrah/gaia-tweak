'use client';

import { EffectComposer, Bloom } from '@react-three/postprocessing';

export function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom intensity={1.0} luminanceThreshold={0.4} />
    </EffectComposer>
  );
}
