'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';

import { useMetricsStore } from '@/store/metricsStore';

interface PerformanceMemory {
  usedJSHeapSize: number;
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
}

export function MetricsMonitor() {
  const gl = useThree(state => state.gl);
  const { setStats } = useMetricsStore();

  const frameCount = useRef(0);
  const lastUpdate = useRef(performance.now());

  useEffect(() => {
    gl.info.autoReset = false;
  }, [gl]);

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
      const triangleCount = info.render.triangles / fps;
      const drawCalls = info.render.calls / fps;

      setStats(fps, memoryUsage, triangleCount, drawCalls);
      gl.info.reset();

      frameCount.current = 0;
      lastUpdate.current = now;
    }
  });

  return null;
}
