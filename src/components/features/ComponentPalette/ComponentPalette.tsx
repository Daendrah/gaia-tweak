'use client';

import { useMemo } from 'react';

import { ComponentButton } from '@/components/features/ComponentPalette/ComponentButton';
import { componentRegistry } from '@/lib/world/componentRegistry';
import { useUIStore } from '@/store/uiStore';

export function ComponentPalette() {
  const selectComponent = useUIStore(state => state.selectComponent);
  const selectedComponentKey = useUIStore(state => state.selectedComponentKey);

  const componentDefinitions = useMemo(() => {
    return componentRegistry.getAllDefinitions();
  }, []);

  return (
    <div className="flex flex-col items-center gap-2 py-2">
      {componentDefinitions.map(definition => {
        const isSelected = selectedComponentKey === definition.key;

        return (
          <ComponentButton
            key={definition.key}
            icon={definition.icon}
            label={definition.name}
            onClick={() => selectComponent(definition.key)}
            isSelected={isSelected}
          />
        );
      })}
    </div>
  );
}
