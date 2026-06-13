import { Trees } from 'lucide-react';
import { biomesBuilder } from './biomes.builder';
import { biomesParams } from './biomes.types';
import { ComponentDescriptor } from '@/types/worldTypes';

export const biomesDescriptor: ComponentDescriptor = {
  key: 'biomes',
  name: 'Biomes',
  icon: Trees,
  builder: biomesBuilder,
  params: biomesParams,
};
