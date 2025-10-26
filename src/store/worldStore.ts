import * as THREE from 'three';
import { create } from 'zustand';

import { useBuildJobStore } from '@/store/buildJobStore';
import { ComponentBuilder, ParameterDefinition, ParameterValue } from '@/types/worldTypes';

interface ComponentInstance {
  params: Record<string, ParameterValue>;
  active: boolean;
  builder: ComponentBuilder;
}

interface WorldState {
  world: THREE.Scene | null;
  componentInstances: Record<string, ComponentInstance>;
  setWorld: (world: THREE.Scene) => void;
  createComponentInstance: (
    key: string,
    params: ParameterDefinition[],
    builder: ComponentBuilder
  ) => void;

  buildAll(): void;
  resetAll(): void;
  buildComponent(key: string): void;
  resetComponent(key: string): void;
}

export const useWorldStore = create<WorldState>((set, get) => ({
  world: null,
  componentInstances: {},

  setWorld: world => set({ world }),
  createComponentInstance: (key, params, builder) => {
    function definitionToValues(params: ParameterDefinition[]): Record<string, ParameterValue> {
      return params.reduce(
        (acc, param) => {
          acc[param.key] = param.value;
          return acc;
        },
        {} as Record<string, ParameterValue>
      );
    }

    const values = definitionToValues(params);
    const component: ComponentInstance = {
      params: values,
      active: false,
      builder,
    };

    set(state => ({
      componentInstances: {
        ...state.componentInstances,
        [key]: component,
      },
    }));
  },

  buildAll: () => {
    const componentInstances = get().componentInstances;
    Object.keys(componentInstances).forEach(key => {
      get().buildComponent(key);
    });
  },

  resetAll: () => {
    const componentInstances = get().componentInstances;
    Object.keys(componentInstances).forEach(key => {
      get().resetComponent(key);
    });
  },

  buildComponent: (key: string) => {
    const { world, componentInstances } = get();
    if (!world) {
      console.error('World not initialized');
      return;
    }

    const instance = componentInstances[key];
    if (!instance) {
      console.error(`Component ${key} not found`);
      return;
    }

    const submitJob = useBuildJobStore.getState().submitJob;
    const job = instance.builder.generateJob();
    const context = { world, params: instance.params };

    submitJob(job, context)
      .then(() => {
        set(state => ({
          componentInstances: {
            ...state.componentInstances,
            [key]: { ...state.componentInstances[key], active: true },
          },
        }));
      })
      .catch((error: unknown) => {
        console.error(`Build failed for component ${key}:`, error);
        get().resetComponent(key);
      });
  },

  resetComponent: (key: string) => {
    const { world, componentInstances } = get();
    if (!world) {
      console.error('World not initialized');
      return;
    }

    const instance = componentInstances[key];
    if (!instance) {
      console.error(`Component ${key} not found`);
      return;
    }

    instance.builder.reset(world);
    set(state => ({
      componentInstances: {
        ...state.componentInstances,
        [key]: { ...state.componentInstances[key], active: false },
      },
    }));
  },
}));
