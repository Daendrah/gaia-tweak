import { Droplets } from 'lucide-react';
import { waterBuilder } from './water.builder';
import { waterParams } from './water.types';
import { ComponentDescriptor } from '@/types/worldTypes';

export const waterDescriptor: ComponentDescriptor = {
  key: 'water',
  name: 'Water',
  icon: Droplets,
  builder: waterBuilder,
  params: waterParams,
};
