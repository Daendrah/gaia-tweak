import { Mountain } from 'lucide-react';
import { terrainBuilder } from './terrain.builder';
import { terrainParams } from './terrain.types';
import { ComponentDescriptor } from '@/types/worldTypes';

export const terrainDescriptor: ComponentDescriptor = {
  key: 'terrain',
  name: 'Terrain',
  icon: Mountain,
  builder: terrainBuilder,
  params: terrainParams,
};
