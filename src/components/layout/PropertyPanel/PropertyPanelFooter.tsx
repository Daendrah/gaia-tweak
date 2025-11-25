'use client';

import { Check, RotateCcw } from 'lucide-react';
import { Button, DrawerFooter } from '@heroui/react';

import { componentRegistry } from '@/lib/world/componentRegistry';
import { useComponentsStore } from '@/store/componentsStore';
import { useUIStore } from '@/store/uiStore';
import { useWorldStore } from '@/store/worldStore';

export function PropertyPanelFooter() {
  const componentKey = useUIStore(state => state.selectedComponentKey);
  if (!componentKey) throw new Error('PropertyPanelFooter must be used with a selected component');

  const hasChanges = useComponentsStore(
    state => (state.componentInstances[componentKey]?.pendingCount ?? 0) > 0
  );

  const isActive = useComponentsStore(
    state => Object.keys(state.componentInstances[componentKey]?.committed ?? {}).length > 0
  );

  const generateComponent = useWorldStore(state => state.generateComponent);
  const clearComponent = useWorldStore(state => state.clearComponent);

  const componentDefinition = componentRegistry.getDefinition(componentKey);
  if (!componentDefinition) return null;

  const handleApply = () => {
    generateComponent(componentKey);
  };

  const handleReset = () => {
    clearComponent(componentKey);
  };

  return (
    <DrawerFooter className="grid grid-cols-[1fr_auto] gap-4 px-4 py-2">
      <Button
        aria-label={'Apply'}
        color={'primary'}
        startContent={<Check size={20} />}
        onPress={handleApply}
        radius="sm"
        variant={'solid'}
        isDisabled={!hasChanges}
      >
        Apply
      </Button>
      <Button
        aria-label={'Reset'}
        color={'danger'}
        startContent={<RotateCcw size={20} />}
        onPress={handleReset}
        radius="sm"
        variant={'solid'}
        isDisabled={!isActive}
      >
        Reset
      </Button>
    </DrawerFooter>
  );
}
