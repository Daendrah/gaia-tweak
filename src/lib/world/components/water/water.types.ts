import { ParameterDefinition, ParameterType } from '@/types/worldTypes';

export const waterParams: ParameterDefinition[] = [
  {
    key: 'numRivers',
    label: 'Number of Rivers',
    description: 'Number of rivers to generate',
    type: ParameterType.SLIDER,
    value: 30,
    min: 0,
    max: 100,
    step: 1,
    section: 'Rivers',
  },
  {
    key: 'riverWidth',
    label: 'River Width',
    description: 'Base width of rivers',
    type: ParameterType.SLIDER,
    value: 2,
    min: 0.5,
    max: 10,
    step: 0.1,
    section: 'Rivers',
  },
  {
    key: 'oceanLevel',
    label: 'Ocean Level',
    description: 'Height of ocean surface',
    type: ParameterType.SLIDER,
    value: 0,
    min: -20,
    max: 20,
    step: 0.5,
    section: 'Ocean',
  },
  {
    key: 'oceanColor',
    label: 'Ocean Color',
    description: 'Color of ocean water',
    type: ParameterType.COLOR,
    value: '#44447a',
    section: 'Ocean',
  },
  {
    key: 'oceanOpacity',
    label: 'Ocean Opacity',
    description: 'Transparency of ocean water',
    type: ParameterType.SLIDER,
    value: 0.8,
    min: 0,
    max: 1,
    step: 0.01,
    section: 'Ocean',
  },
  {
    key: 'lakeColor',
    label: 'Lake Color',
    description: 'Color of lake water',
    type: ParameterType.COLOR,
    value: '#336699',
    section: 'Lakes',
  },
  {
    key: 'lakeOpacity',
    label: 'Lake Opacity',
    description: 'Transparency of lake water',
    type: ParameterType.SLIDER,
    value: 0.7,
    min: 0,
    max: 1,
    step: 0.01,
    section: 'Lakes',
  },
  {
    key: 'riverColor',
    label: 'River Color',
    description: 'Color of river water',
    type: ParameterType.COLOR,
    value: '#225588',
    section: 'Rivers',
  },
  {
    key: 'showOcean',
    label: 'Show Ocean',
    description: 'Display ocean water',
    type: ParameterType.BOOLEAN,
    value: true,
    section: 'Visibility',
  },
  {
    key: 'showLakes',
    label: 'Show Lakes',
    description: 'Display lake water',
    type: ParameterType.BOOLEAN,
    value: true,
    section: 'Visibility',
  },
  {
    key: 'showRivers',
    label: 'Show Rivers',
    description: 'Display rivers',
    type: ParameterType.BOOLEAN,
    value: true,
    section: 'Visibility',
  },
  {
    key: 'waterReflectivity',
    label: 'Water Reflectivity',
    description: 'How reflective water surfaces are',
    type: ParameterType.SLIDER,
    value: 0.5,
    min: 0,
    max: 1,
    step: 0.01,
    section: 'Appearance',
  },
];

export interface WaterMapData {
  ocean_r: boolean[];
  water_r: boolean[];
  t_spring: number[];
  t_river: number[];
  flow_s: number[];
  numRegions: number;
  numTriangles: number;
  numSides: number;
}
