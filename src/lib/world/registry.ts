import {
  lightingDescriptor,
  lightingDescriptor2,
  lightingDescriptor3,
  lightingDescriptor4,
  lightingDescriptor5,
  lightingDescriptor6,
  lightingDescriptor7,
} from '@/lib/world/components/lighting/lighting.descriptor';
import { ComponentDescriptor } from '@/types/worldTypes';

export const WORLD_COMPONENTS: ComponentDescriptor[] = [
  lightingDescriptor,
  lightingDescriptor2,
  lightingDescriptor3,
  lightingDescriptor4,
  lightingDescriptor5,
  lightingDescriptor6,
  lightingDescriptor7,
];

export function getComponentByKey(key: string): ComponentDescriptor | undefined {
  return WORLD_COMPONENTS.find(c => c.key === key);
}
