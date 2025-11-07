import * as THREE from 'three';

import { ParameterValue } from '@/types/worldTypes';

export interface CommandContext {
  world: THREE.Scene;
  params: Record<string, ParameterValue>;
}

export interface CommandStep {
  name: string;
  execute: (context: CommandContext) => Promise<void>;
}

export interface GenerationCommand {
  componentName: string;
  steps: CommandStep[];
}

export interface CommandStatus {
  componentName: string;
  stepName: string;
  promise: Promise<void>;
}
