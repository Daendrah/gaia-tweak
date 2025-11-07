import { create } from 'zustand';

import { componentRegistry } from '@/lib/world/componentRegistry';
import { ParameterDefinition, ParameterValue } from '@/types/worldTypes';

export interface ComponentState {
  pending: Record<string, ParameterValue>;
  committed: Record<string, ParameterValue>;
  pendingCount: number;
}

interface ComponentsState {
  componentInstances: Record<string, ComponentState>;
  isInitialized: boolean;

  initializeInstances: () => void;
  updateParameter: (componentKey: string, paramKey: string, value: ParameterValue) => void;
  getPendingValue: (componentKey: string, paramKey: string) => ParameterValue | undefined;
  getComponentKeys: () => string[];
  hasComponent: (componentKey: string) => boolean;
  applyChanges: (componentKey: string) => void;
  resetParameter: (componentKey: string, paramKey: string) => void;
  clearComponent: (componentKey: string) => void;
}

function definitionToValues(params: ParameterDefinition[]): Record<string, ParameterValue> {
  return params.reduce(
    (acc, param) => {
      acc[param.key] = param.value;
      return acc;
    },
    {} as Record<string, ParameterValue>
  );
}

function createComponentInstances(): Record<string, ComponentState> {
  const descriptors = componentRegistry.getAllDescriptors();

  if (descriptors.length === 0) {
    console.warn('Component registry is empty. No instances created.');
    return {};
  }

  const instances: Record<string, ComponentState> = {};

  descriptors.forEach(descriptor => {
    const values = definitionToValues(descriptor.params);
    instances[descriptor.key] = {
      pending: values,
      committed: {},
      pendingCount: Object.keys(values).length,
    };
  });

  return instances;
}

export const useComponentsStore = create<ComponentsState>((set, get) => ({
  componentInstances: {},
  isInitialized: false,

  initializeInstances: () => {
    if (!get().isInitialized) {
      const instances = createComponentInstances();
      set({
        componentInstances: instances,
        isInitialized: true,
      });
    }
  },

  updateParameter: (componentKey, paramKey, value) => {
    set(state => {
      const instance = state.componentInstances[componentKey];
      if (!instance) {
        console.error(`Component ${componentKey} not found`);
        return state;
      }

      const currentValue = instance.pending[paramKey];
      const committedValue = instance.committed[paramKey];

      if (currentValue === value) {
        return state;
      }

      let newPendingCount = instance.pendingCount;

      if (currentValue === committedValue) {
        newPendingCount++;
      } else if (value === committedValue) {
        newPendingCount--;
      }

      return {
        componentInstances: {
          ...state.componentInstances,
          [componentKey]: {
            ...instance,
            pending: {
              ...instance.pending,
              [paramKey]: value,
            },
            pendingCount: newPendingCount,
          },
        },
      };
    });
  },

  getPendingValue: (componentKey: string, paramKey: string) => {
    const instance = get().componentInstances[componentKey];
    return instance?.pending[paramKey];
  },

  getComponentKeys: () => {
    return Object.keys(get().componentInstances);
  },

  hasComponent: (componentKey: string) => {
    return get().componentInstances[componentKey] !== undefined;
  },

  applyChanges: (componentKey: string) => {
    set(state => {
      const instance = state.componentInstances[componentKey];
      if (!instance) {
        console.error(`Component ${componentKey} not found`);
        return state;
      }

      return {
        componentInstances: {
          ...state.componentInstances,
          [componentKey]: {
            ...instance,
            committed: { ...instance.pending },
            pendingCount: 0,
          },
        },
      };
    });
  },

  resetParameter: (componentKey: string, paramKey: string) => {
    set(state => {
      const instance = state.componentInstances[componentKey];
      if (!instance) {
        console.error(`Component ${componentKey} not found`);
        return state;
      }

      const committedValue = instance.committed[paramKey];
      const currentValue = instance.pending[paramKey];

      // Si le paramètre n'est pas modifié, ne rien faire
      if (currentValue === committedValue) {
        return state;
      }

      return {
        componentInstances: {
          ...state.componentInstances,
          [componentKey]: {
            ...instance,
            pending: {
              ...instance.pending,
              [paramKey]: committedValue,
            },
            pendingCount: instance.pendingCount - 1,
          },
        },
      };
    });
  },

  clearComponent: (componentKey: string) => {
    set(state => {
      const instance = state.componentInstances[componentKey];
      if (!instance) {
        console.error(`Component ${componentKey} not found`);
        return state;
      }

      const newPendingCount = Object.keys(instance.pending).length;

      return {
        componentInstances: {
          ...state.componentInstances,
          [componentKey]: {
            ...instance,
            committed: {},
            pendingCount: newPendingCount,
          },
        },
      };
    });
  },
}));
