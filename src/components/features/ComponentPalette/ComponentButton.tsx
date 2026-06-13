'use client';

import { Button, Tooltip } from '@heroui/react';
import React, { memo } from 'react';

interface ComponentButtonProps {
  onClick: () => void;
  label: string;
  icon: React.ElementType;
  isSelected: boolean;
}

export const ComponentButton = memo(function ComponentButton({
  onClick,
  label,
  icon,
  isSelected,
}: ComponentButtonProps) {
  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Button
          aria-label={label}
          className="size-10 rounded-sm"
          variant={isSelected ? 'primary' : 'ghost'}
          isIconOnly
          onPress={onClick}
        >
          {React.createElement(icon, { size: 20 })}
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content placement="right" offset={15} className="rounded-sm">
        {label}
      </Tooltip.Content>
    </Tooltip>
  );
});
