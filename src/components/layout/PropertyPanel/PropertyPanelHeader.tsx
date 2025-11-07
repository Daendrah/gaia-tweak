'use client';

import { Button, DrawerHeader, Tooltip } from '@heroui/react';
import { X } from 'lucide-react';
import React from 'react';

import { componentRegistry } from '@/lib/world/componentRegistry';
import { useUIStore } from '@/store/uiStore';

export function PropertyPanelHeader() {
  const selectComponent = useUIStore(state => state.selectComponent);
  const componentKey = useUIStore(state => state.selectedComponentKey);

  if (!componentKey) throw new Error('PropertyPanelHeader must be used with a selected component');

  const componentDefinition = componentRegistry.getDefinition(componentKey);
  if (!componentDefinition) return null;

  return (
    <DrawerHeader className="grid grid-cols-[auto_1fr_auto] items-center px-2 py-2 gap-2">
      {React.createElement(componentDefinition.icon, { size: 32, color: 'currentColor' })}
      <span className="text-2xl">{componentDefinition.name}</span>
      <Tooltip key={'drawer-close'} color="default" content={'Close'} radius="sm">
        <Button
          aria-label={'Close'}
          color={'default'}
          isIconOnly
          onPress={() => selectComponent(null)}
          radius="sm"
          variant={'light'}
        >
          <X size={20} />
        </Button>
      </Tooltip>
    </DrawerHeader>
  );
}
