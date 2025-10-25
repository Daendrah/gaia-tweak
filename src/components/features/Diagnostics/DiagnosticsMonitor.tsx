'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';

import { useDiagnosticsStore } from '@/store/diagnosticsStore';

interface PerformanceMemory {
  usedJSHeapSize: number;
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
}

export default function DiagnosticsMonitor() {
  const gl = useThree(state => state.gl);
  const { setStats } = useDiagnosticsStore();

  const frameCount = useRef(0);
  const lastUpdate = useRef(performance.now());

  useFrame(() => {
    frameCount.current += 1;
    const now = performance.now();

    if (now - lastUpdate.current >= 1000) {
      const fps = frameCount.current;
      const memoryUsage =
        'memory' in window.performance
          ? (window.performance as Performance & { memory: PerformanceMemory }).memory
              .usedJSHeapSize
          : 0;

      const info = gl.info;
      const triangleCount = info.render.triangles;
      const drawCalls = info.render.calls;

      setStats(fps, memoryUsage, triangleCount, drawCalls);

      frameCount.current = 0;
      lastUpdate.current = now;
    }
  });

  return null;
}
