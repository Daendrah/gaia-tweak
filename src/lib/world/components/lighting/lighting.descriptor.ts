import CloudIcon from '@mui/icons-material/Cloud';
import GridOnIcon from '@mui/icons-material/GridOn';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ParkIcon from '@mui/icons-material/Park';
import TerrainIcon from '@mui/icons-material/Terrain';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

import { lightingBuilder } from '@/lib/world/components/lighting/lighting.builder';
import { lightingParams } from '@/lib/world/components/lighting/lighting.types';
import { ComponentDescriptor } from '@/types/worldTypes';

export const lightingDescriptor: ComponentDescriptor = {
  key: 'lighting',
  name: 'Lighting',
  icon: WallpaperIcon,
  builder: lightingBuilder,
  params: lightingParams,
};

export const lightingDescriptor2: ComponentDescriptor = {
  key: 'lighting2',
  name: 'Lighting',
  icon: LightbulbIcon,
  builder: lightingBuilder,
  params: lightingParams,
};

export const lightingDescriptor3: ComponentDescriptor = {
  key: 'lighting3',
  name: 'Lighting',
  icon: GridOnIcon,
  builder: lightingBuilder,
  params: lightingParams,
};

export const lightingDescriptor4: ComponentDescriptor = {
  key: 'lighting4',
  name: 'Lighting',
  icon: WaterDropIcon,
  builder: lightingBuilder,
  params: lightingParams,
};

export const lightingDescriptor5: ComponentDescriptor = {
  key: 'lighting5',
  name: 'Lighting',
  icon: TerrainIcon,
  builder: lightingBuilder,
  params: lightingParams,
};

export const lightingDescriptor6: ComponentDescriptor = {
  key: 'lighting6',
  name: 'Lighting',
  icon: ParkIcon,
  builder: lightingBuilder,
  params: lightingParams,
};

export const lightingDescriptor7: ComponentDescriptor = {
  key: 'lighting7',
  name: 'Lighting',
  icon: CloudIcon,
  builder: lightingBuilder,
  params: lightingParams,
};
