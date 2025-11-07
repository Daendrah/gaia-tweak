'use client';

import React, { memo } from 'react';

interface MetricsItemProps {
  icon: React.ElementType;
  value: number;
  unit: string;
}

export const MetricsItem = memo<MetricsItemProps>(({ icon, value, unit }) => {
  return (
    <div className="flex items-center gap-2 w-28 h-10">
      <span className="text-primary">
        {React.createElement(icon, { size: 20, color: 'currentColor' })}
      </span>
      <span>{value}</span>
      <span className="text-default-500">{unit}</span>
    </div>
  );
});

MetricsItem.displayName = 'MetricsItem';
