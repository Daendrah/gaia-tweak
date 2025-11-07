import * as THREE from 'three';

import { GenerationCommand } from '@/types/generationTypes';

export type ParameterValue = string | number | boolean;

export enum ParameterType {
  SLIDER = 'slider',
  NUMBER = 'number',
  COLOR = 'color',
  BOOLEAN = 'checkbox',
  SELECT = 'select',
}

export interface ParameterDefinition {
  key: string;
  label: string;
  description: string;
  type: ParameterType;
  value: ParameterValue;
  min?: number;
  max?: number;
  step?: number;
  items?: string[];
  section: string;
}

export interface ComponentBuilder {
  generateCommand: () => GenerationCommand;
  reset: (world: THREE.Scene) => void;
  isActive: (world: THREE.Scene) => boolean;
}

export interface ComponentDescriptor {
  key: string;
  name: string;
  icon: React.ElementType;
  builder: ComponentBuilder;
  params: ParameterDefinition[];
}
