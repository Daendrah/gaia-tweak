import * as THREE from 'three';
import { create } from 'zustand';

import { componentRegistry } from '@/lib/world/componentRegistry';
import { useCommandQueueStore } from '@/store/commandQueueStore';
import { useComponentsStore } from '@/store/componentsStore';
import { ParameterValue } from '@/types/worldTypes';

interface WorldState {
  world: THREE.Scene | null;

  setWorld: (world: THREE.Scene) => void;

  generateAll(): void;
  clearAll(): void;
  generateComponent(key: string): void;
  clearComponent(key: string): void;
}

export const useWorldStore = create<WorldState>((set, get) => ({
  world: null,

  setWorld: world => {
    set({ world });

    useComponentsStore.getState().initializeInstances();
  },

  generateAll: () => {
    const componentsStore = useComponentsStore.getState();
    const componentKeys = componentsStore.getComponentKeys();
    componentKeys.forEach(key => {
      get().generateComponent(key);
    });
  },

  clearAll: () => {
    const componentsStore = useComponentsStore.getState();
    const componentKeys = componentsStore.getComponentKeys();
    componentKeys.forEach(key => {
      get().clearComponent(key);
    });
  },

  generateComponent: (key: string) => {
    const { world } = get();
    if (!world) throw new Error('World not initialized');

    const componentsStore = useComponentsStore.getState();
    if (!componentsStore.hasComponent(key)) {
      throw new Error(`Instance ${key} not found`);
    }

    const builder = componentRegistry.getDescriptor(key)?.builder;
    if (!builder) throw new Error(`Descriptor ${key} not found`);

    const submitCommand = useCommandQueueStore.getState().submitCommand;
    const command = builder.generateCommand();

    const descriptor = componentRegistry.getDescriptor(key);
    if (!descriptor) throw new Error(`Descriptor ${key} not found`);

    const params: Record<string, ParameterValue> = {};
    descriptor.params.forEach(param => {
      const value = componentsStore.getPendingValue(key, param.key);
      if (value !== undefined) {
        params[param.key] = value;
      }
    });

    const context = { world, params };

    submitCommand(command, context)
      .then(() => {
        componentsStore.applyChanges(key);
      })
      .catch((error: unknown) => {
        console.error(`Generation failed for component ${key}:`, error);
        get().clearComponent(key);
      });
  },

  clearComponent: (key: string) => {
    const { world } = get();
    if (!world) throw new Error('World not initialized');

    const componentsStore = useComponentsStore.getState();
    if (!componentsStore.hasComponent(key)) {
      throw new Error(`Instance ${key} not found`);
    }

    const builder = componentRegistry.getDescriptor(key)?.builder;
    if (!builder) throw new Error(`Descriptor ${key} not found`);

    builder.reset(world);
    componentsStore.clearComponent(key);
  },
}));
