'use client';

import { CommandProgress } from '@/components/features/CommandProgress/CommandProgress';
import { MetricsOverlay } from '@/components/features/MetricsOverlay/MetricsOverlay';
import { World } from '@/components/features/World/World';

export function Viewport() {
  return (
    <div className="flex-1">
      <World />
      <MetricsOverlay />
      <CommandProgress />
    </div>
  );
}
