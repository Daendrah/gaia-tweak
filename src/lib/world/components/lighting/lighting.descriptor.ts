import { Box, Cloud, Droplets, Grid3x3, Lightbulb, Mountain, Trees } from 'lucide-react';

import { lightingBuilder } from '@/lib/world/components/lighting/lighting.builder';
import { lightingParams } from '@/lib/world/components/lighting/lighting.types';
import { ComponentDescriptor } from '@/types/worldTypes';

export const lightingDescriptor2: ComponentDescriptor = {
  key: 'lighting2',
  name: 'Lighting',
  icon: Lightbulb,
  builder: lightingBuilder,
  params: lightingParams,
};

export const lightingDescriptor3: ComponentDescriptor = {
  key: 'lighting3',
  name: 'Terrain',
  icon: Grid3x3,
  builder: lightingBuilder,
  params: lightingParams,
};

export const lightingDescriptor4: ComponentDescriptor = {
  key: 'lighting4',
  name: 'Water',
  icon: Droplets,
  builder: lightingBuilder,
  params: lightingParams,
};

export const lightingDescriptor5: ComponentDescriptor = {
  key: 'lighting5',
  name: 'Biomes',
  icon: Mountain,
  builder: lightingBuilder,
  params: lightingParams,
};

export const lightingDescriptor6: ComponentDescriptor = {
  key: 'lighting6',
  name: 'Vegetation',
  icon: Trees,
  builder: lightingBuilder,
  params: lightingParams,
};

export const lightingDescriptor7: ComponentDescriptor = {
  key: 'lighting7',
  name: 'Weather',
  icon: Cloud,
  builder: lightingBuilder,
  params: lightingParams,
};
