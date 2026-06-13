import { ParameterDefinition, ParameterType } from '@/types/worldTypes';

export const biomesParams: ParameterDefinition[] = [
  {
    key: 'northTemperature',
    label: 'North Temperature',
    description: 'Temperature bias for northern areas',
    type: ParameterType.SLIDER,
    value: 0,
    min: -0.5,
    max: 0.5,
    step: 0.01,
    section: 'Temperature',
  },
  {
    key: 'southTemperature',
    label: 'South Temperature',
    description: 'Temperature bias for southern areas',
    type: ParameterType.SLIDER,
    value: 0,
    min: -0.5,
    max: 0.5,
    step: 0.01,
    section: 'Temperature',
  },
  {
    key: 'moistureBias',
    label: 'Moisture Bias',
    description: 'Overall moisture adjustment',
    type: ParameterType.SLIDER,
    value: 0,
    min: -0.3,
    max: 0.3,
    step: 0.01,
    section: 'Moisture',
  },
  {
    key: 'minMoisture',
    label: 'Minimum Moisture',
    description: 'Minimum moisture level',
    type: ParameterType.SLIDER,
    value: 0,
    min: 0,
    max: 0.5,
    step: 0.01,
    section: 'Moisture',
  },
  {
    key: 'maxMoisture',
    label: 'Maximum Moisture',
    description: 'Maximum moisture level',
    type: ParameterType.SLIDER,
    value: 1,
    min: 0.5,
    max: 1,
    step: 0.01,
    section: 'Moisture',
  },
  {
    key: 'redistributeMoisture',
    label: 'Redistribute Moisture',
    description: 'Apply moisture redistribution for even distribution',
    type: ParameterType.BOOLEAN,
    value: true,
    section: 'Moisture',
  },
  {
    key: 'showBiomeColors',
    label: 'Show Biome Colors',
    description: 'Color regions by biome type',
    type: ParameterType.BOOLEAN,
    value: true,
    section: 'Visualization',
  },
  {
    key: 'showBiomeBoundaries',
    label: 'Show Biome Boundaries',
    description: 'Display boundaries between biomes',
    type: ParameterType.BOOLEAN,
    value: false,
    section: 'Visualization',
  },
];

// Biome type definitions
export enum BiomeType {
  OCEAN = 'OCEAN',
  LAKE = 'LAKE',
  MARSH = 'MARSH',
  ICE = 'ICE',
  BEACH = 'BEACH',
  SNOW = 'SNOW',
  TUNDRA = 'TUNDRA',
  BARE = 'BARE',
  SCORCHED = 'SCORCHED',
  TAIGA = 'TAIGA',
  SHRUBLAND = 'SHRUBLAND',
  TEMPERATE_DESERT = 'TEMPERATE_DESERT',
  TEMPERATE_RAIN_FOREST = 'TEMPERATE_RAIN_FOREST',
  TEMPERATE_DECIDUOUS_FOREST = 'TEMPERATE_DECIDUOUS_FOREST',
  GRASSLAND = 'GRASSLAND',
  TROPICAL_RAIN_FOREST = 'TROPICAL_RAIN_FOREST',
  TROPICAL_SEASONAL_FOREST = 'TROPICAL_SEASONAL_FOREST',
  SUBTROPICAL_DESERT = 'SUBTROPICAL_DESERT',
}

// Biome color mapping
export const BIOME_COLORS: Record<BiomeType, string> = {
  [BiomeType.OCEAN]: '#44447a',
  [BiomeType.LAKE]: '#336699',
  [BiomeType.MARSH]: '#2f6666',
  [BiomeType.ICE]: '#99ffff',
  [BiomeType.BEACH]: '#a09077',
  [BiomeType.SNOW]: '#ffffff',
  [BiomeType.TUNDRA]: '#bbbbaa',
  [BiomeType.BARE]: '#888888',
  [BiomeType.SCORCHED]: '#999999',
  [BiomeType.TAIGA]: '#99aa77',
  [BiomeType.SHRUBLAND]: '#889977',
  [BiomeType.TEMPERATE_DESERT]: '#c9d29b',
  [BiomeType.TEMPERATE_RAIN_FOREST]: '#448855',
  [BiomeType.TEMPERATE_DECIDUOUS_FOREST]: '#679459',
  [BiomeType.GRASSLAND]: '#88aa55',
  [BiomeType.TROPICAL_RAIN_FOREST]: '#337755',
  [BiomeType.TROPICAL_SEASONAL_FOREST]: '#559944',
  [BiomeType.SUBTROPICAL_DESERT]: '#d2b98b',
};

export interface BiomesMapData {
  coast_r: boolean[];
  temperature_r: number[];
  moisture_r: number[];
  waterdistance_r: number[];
  biome_r: BiomeType[];
  numRegions: number;
}
