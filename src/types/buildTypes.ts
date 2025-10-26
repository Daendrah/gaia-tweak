import * as THREE from 'three';

import { ParameterValue } from '@/types/worldTypes';

export interface BuildContext {
  world: THREE.Scene;
  params: Record<string, ParameterValue>;
}

export interface BuildStep {
  name: string;
  execute: (context: BuildContext) => Promise<void>;
}

export interface BuildJob {
  componentName: string;
  steps: BuildStep[];
}

export interface BuildStatus {
  componentName: string;
  stepName: string;
  currentStep: number;
  totalSteps: number;
  status: 'in-progress' | 'success' | 'failed';
}
