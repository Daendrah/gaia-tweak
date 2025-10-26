import { useEffect } from 'react';

import { WORLD_COMPONENTS } from '@/lib/world/registry';
import { useUIStore } from '@/store/uiStore';
import { useWorldStore } from '@/store/worldStore';

export function useRegisterComponents() {
  const addWorldComponent = useUIStore(state => state.addWorldComponent);
  const createComponentInstance = useWorldStore(state => state.createComponentInstance);
  useEffect(() => {
    if (!WORLD_COMPONENTS || WORLD_COMPONENTS.length === 0) {
      console.warn('No world components found to register.');
      return;
    }

    WORLD_COMPONENTS.forEach(descriptor => {
      try {
        addWorldComponent(descriptor.key, descriptor.name, descriptor.icon);
        createComponentInstance(descriptor.key, descriptor.params, descriptor.builder);
        console.log(`Registered world component: ${descriptor.name}`);
      } catch (error) {
        console.error(`Failed to register component '${descriptor.key}':`, error);
      }
    });
  }, [addWorldComponent, createComponentInstance]);
}
