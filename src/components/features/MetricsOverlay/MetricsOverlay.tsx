'use client';

import { Card, CardBody } from '@heroui/react';
import { Brush, Cpu, MemoryStick, Triangle } from 'lucide-react';
import { memo } from 'react';

import { MetricsItem } from '@/components/features/MetricsOverlay/MetricsItem';
import { useMetricsStore } from '@/store/metricsStore';

const FpsMetric = memo(() => {
  const fps = useMetricsStore(state => state.fps);
  return <MetricsItem icon={Cpu} unit="FPS" value={Math.round(fps)} />;
});

const MemoryMetric = memo(() => {
  const memoryUsage = useMetricsStore(state => state.memoryUsage);
  const memory = Math.round(memoryUsage / (1024 * 1024));
  return <MetricsItem icon={MemoryStick} unit="MB" value={memory} />;
});

const DrawCallsMetric = memo(() => {
  const drawCalls = useMetricsStore(state => state.drawCalls);
  return <MetricsItem icon={Brush} unit="Draws" value={Math.round(drawCalls)} />;
});

const TrianglesMetric = memo(() => {
  const triangleCount = useMetricsStore(state => state.triangleCount);
  return <MetricsItem icon={Triangle} unit="Tris" value={Math.round(triangleCount)} />;
});

export function MetricsOverlay() {
  return (
    <Card className="absolute bottom-2 left-16 bg-background" radius="sm" shadow="sm">
      <CardBody className="p-0">
        <div className="grid grid-cols-2 gap-2 p-2">
          <FpsMetric />
          <MemoryMetric />
          <DrawCallsMetric />
          <TrianglesMetric />
        </div>
      </CardBody>
    </Card>
  );
}

FpsMetric.displayName = 'FpsMetric';
MemoryMetric.displayName = 'MemoryMetric';
DrawCallsMetric.displayName = 'DrawCallsMetric';
TrianglesMetric.displayName = 'TrianglesMetric';
