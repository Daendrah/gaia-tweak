import { create } from 'zustand';

import { BuildJob, BuildContext, BuildStatus } from '@/types/buildTypes';

interface BuildJobQueueState {
  queueStatus: BuildStatus | null;
  submitJob: (job: BuildJob, context: BuildContext) => Promise<void>;
}

interface QueuedJob {
  job: BuildJob;
  context: BuildContext;
  resolve: () => void;
  reject: (error: Error) => void;
}

class BuildJobQueue {
  private queue: QueuedJob[] = [];
  private processing = false;
  private updateState: (status: BuildStatus | null) => void;

  constructor(updateState: (status: BuildStatus | null) => void) {
    this.updateState = updateState;
  }

  async submit(job: BuildJob, context: BuildContext): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.queue.push({ job, context, resolve, reject });
      this.process();
    });
  }

  private async process(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const queuedJob = this.queue.shift()!;
      const { job, context, resolve, reject } = queuedJob;

      try {
        for (let i = 0; i < job.steps.length; i++) {
          const step = job.steps[i];

          this.updateState({
            componentName: job.componentName,
            stepName: step.name,
            currentStep: i,
            totalSteps: job.steps.length,
            status: 'in-progress',
          });

          await step.execute(context);
        }

        this.updateState({
          componentName: job.componentName,
          stepName: '',
          currentStep: job.steps.length,
          totalSteps: job.steps.length,
          status: 'success',
        });

        resolve();
      } catch (error) {
        this.updateState({
          componentName: job.componentName,
          stepName: 'Failed',
          currentStep: 0,
          totalSteps: job.steps.length,
          status: 'failed',
        });

        console.error(`Build job failed for ${job.componentName}:`, error);

        reject(error as Error);
      }
    }

    this.processing = false;
  }
}

let queueInstance: BuildJobQueue | null = null;

export const useBuildJobStore = create<BuildJobQueueState>(set => {
  if (!queueInstance) {
    queueInstance = new BuildJobQueue((status: BuildStatus | null) => {
      set({ queueStatus: status });
    });
  }

  return {
    queueStatus: null,

    submitJob: async (job: BuildJob, context: BuildContext): Promise<void> => {
      if (!queueInstance) {
        throw new Error('Build job queue not initialized');
      }
      return queueInstance.submit(job, context);
    },
  };
});
