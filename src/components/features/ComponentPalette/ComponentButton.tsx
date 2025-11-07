'use client';

import { Badge, Button, Tooltip } from '@heroui/react';
import React, { memo } from 'react';

interface ComponentButtonProps {
  onClick: () => void;
  label: string;
  icon: React.ElementType;
  isSelected: boolean;
}

export const ComponentButton = memo(function ComponentButton(props: ComponentButtonProps) {
  const { onClick, label, icon, isSelected } = props;

  return (
    <Tooltip
      key={label}
      color="default"
      content={label}
      placement={'right'}
      radius="sm"
      offset={15}
    >
      <Button
        aria-label={label}
        className="size-10"
        color={isSelected ? 'primary' : 'default'}
        isIconOnly
        onPress={onClick}
        radius="sm"
        variant={isSelected ? 'flat' : 'light'}
      >
        {React.createElement(icon, { size: 20 })}
      </Button>
    </Tooltip>
  );
});

ComponentButton.displayName = 'ComponentButton';
