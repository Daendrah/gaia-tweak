import {
  lightingDescriptor,
  lightingDescriptor3,
  lightingDescriptor4,
  lightingDescriptor5,
  lightingDescriptor6,
  lightingDescriptor7,
} from '@/lib/world/components/lighting/lighting.descriptor';
import { skyboxDescriptor } from '@/lib/world/components/skybox/skybox.descriptor';
import { terrainDescriptor } from '@/lib/world/components/terrain/terrain.descriptor';
import { waterDescriptor } from '@/lib/world/components/water/water.descriptor';
import { biomesDescriptor } from '@/lib/world/components/biomes/biomes.descriptor';
import { ComponentDescriptor, ParameterDefinition } from '@/types/worldTypes';

export interface ComponentDefinition {
  key: string;
  name: string;
  icon: React.ElementType;
  params: ParameterDefinition[];
  paramsBySection: Record<string, ParameterDefinition[]>;
}

function groupParametersBySection(
  params: ParameterDefinition[]
): Record<string, ParameterDefinition[]> {
  return params.reduce(
    (acc, param) => {
      const section = param.section || 'General';
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(param);
      return acc;
    },
    {} as Record<string, ParameterDefinition[]>
  );
}

class ComponentRegistry {
  private components = new Map<string, ComponentDefinition>();
  private descriptors = new Map<string, ComponentDescriptor>();

  constructor(descriptors: ComponentDescriptor[]) {
    descriptors.forEach(descriptor => {
      this.register(descriptor);
    });
  }

  private register(descriptor: ComponentDescriptor): void {
    if (this.components.has(descriptor.key)) {
      console.warn(`Component '${descriptor.key}' already registered`);
      return;
    }

    const definition: ComponentDefinition = {
      key: descriptor.key,
      name: descriptor.name,
      icon: descriptor.icon,
      params: descriptor.params,
      paramsBySection: groupParametersBySection(descriptor.params),
    };

    this.components.set(descriptor.key, definition);
    this.descriptors.set(descriptor.key, descriptor);
  }

  getDefinition(key: string): ComponentDefinition | undefined {
    return this.components.get(key);
  }

  getDescriptor(key: string): ComponentDescriptor | undefined {
    return this.descriptors.get(key);
  }

  getAllDefinitions(): ComponentDefinition[] {
    return Array.from(this.components.values());
  }

  getAllDescriptors(): ComponentDescriptor[] {
    return Array.from(this.descriptors.values());
  }

  getAllKeys(): string[] {
    return Array.from(this.components.keys());
  }

  size(): number {
    return this.components.size;
  }
}

export const componentRegistry = new ComponentRegistry([
  skyboxDescriptor,
  lightingDescriptor,
  terrainDescriptor,
  waterDescriptor,
  biomesDescriptor,
  lightingDescriptor3,
  lightingDescriptor4,
  lightingDescriptor5,
  lightingDescriptor6,
  lightingDescriptor7,
]);
