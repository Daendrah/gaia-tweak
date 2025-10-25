import { create } from 'zustand';

interface DiagnosticsState {
  fps: number;
  memoryUsage: number;
  triangleCount: number;
  drawCalls: number;

  setStats: (fps: number, memoryUsage: number, triangleCount: number, drawCalls: number) => void;
}

export const useDiagnosticsStore = create<DiagnosticsState>((set, get) => ({
  fps: 0,
  memoryUsage: 0,
  triangleCount: 0,
  drawCalls: 0,

  setStats: (fps, memoryUsage, triangleCount, drawCalls) => {
    const state = get();
    if (state.fps !== fps) set({ fps });
    if (state.memoryUsage !== memoryUsage) set({ memoryUsage });
    if (state.triangleCount !== triangleCount) set({ triangleCount });
    if (state.drawCalls !== drawCalls) set({ drawCalls });
  },
}));
