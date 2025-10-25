'use client';

import BrushIcon from '@mui/icons-material/Brush';
import ChangeHistory from '@mui/icons-material/ChangeHistory';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import React, { memo } from 'react';

import DiagnosticsItem from '@/components/features/Diagnostics/DiagnosticsItem';
import { useDiagnosticsStore } from '@/store/diagnosticsStore';

const FpsMetric = memo(() => {
  const fps = useDiagnosticsStore(state => state.fps);
  return <DiagnosticsItem icon={<MemoryIcon />} label="FPS" value={Math.round(fps)} />;
});

const MemoryMetric = memo(() => {
  const memoryUsage = useDiagnosticsStore(state => state.memoryUsage);
  const memory = Math.round(memoryUsage / (1024 * 1024));
  return <DiagnosticsItem icon={<StorageIcon />} label="Memory" value={memory} suffix="MB" />;
});

const DrawCallsMetric = memo(() => {
  const drawCalls = useDiagnosticsStore(state => state.drawCalls);
  return <DiagnosticsItem icon={<BrushIcon />} label="Draw Calls" value={Math.round(drawCalls)} />;
});

const TrianglesMetric = memo(() => {
  const triangleCount = useDiagnosticsStore(state => state.triangleCount);
  return (
    <DiagnosticsItem icon={<ChangeHistory />} label="Triangles" value={Math.round(triangleCount)} />
  );
});

export default function Diagnostics() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <FpsMetric />
      <Divider orientation="vertical" variant="fullWidth" flexItem />
      <MemoryMetric />
      <Divider orientation="vertical" variant="fullWidth" flexItem />
      <DrawCallsMetric />
      <Divider orientation="vertical" variant="fullWidth" flexItem />
      <TrianglesMetric />
    </Box>
  );
}

FpsMetric.displayName = 'FpsMetric';
MemoryMetric.displayName = 'MemoryMetric';
DrawCallsMetric.displayName = 'DrawCallsMetric';
TrianglesMetric.displayName = 'TrianglesMetric';
