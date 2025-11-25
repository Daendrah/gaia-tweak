import { Box } from 'lucide-react';

import { skyboxBuilder } from '@/lib/world/components/skybox/skybox.builder';
import { skyboxParams } from '@/lib/world/components/skybox/skybox.types';
import { ComponentDescriptor } from '@/types/worldTypes';

export const skyboxDescriptor: ComponentDescriptor = {
  key: 'skybox',
  name: 'Skybox',
  icon: Box,
  builder: skyboxBuilder,
  params: skyboxParams,
};
