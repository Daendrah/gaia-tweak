import { CommandContext, CommandStatus, GenerationCommand } from '@/types/generationTypes';

interface CommandScheduler {
  command: GenerationCommand;
  context: CommandContext;
  resolve: () => void;
  reject: (error: Error) => void;
}

export class GenerationScheduler {
  private queue: CommandScheduler[] = [];
  private processing = false;
  private updateState: (status: CommandStatus | null) => void;

  constructor(updateState: (status: CommandStatus | null) => void) {
    this.updateState = updateState;
  }

  async submit(command: GenerationCommand, context: CommandContext): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.queue.push({ command, context, resolve, reject });
      this.process();
    });
  }

  private async process(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const queuedCommand = this.queue.shift()!;
      const { command, context, resolve, reject } = queuedCommand;

      try {
        for (let i = 0; i < command.steps.length; i++) {
          const step = command.steps[i];

          this.updateState({
            componentName: command.componentName,
            stepName: step.name,
            currentStep: i,
            totalSteps: command.steps.length,
            status: 'in-progress',
          });

          await step.execute(context);
        }

        this.updateState({
          componentName: command.componentName,
          stepName: '',
          currentStep: command.steps.length,
          totalSteps: command.steps.length,
          status: 'success',
        });

        resolve();
      } catch (error) {
        this.updateState({
          componentName: command.componentName,
          stepName: 'Failed',
          currentStep: 0,
          totalSteps: command.steps.length,
          status: 'failed',
        });

        console.error(`Generation command failed for ${command.componentName}:`, error);

        reject(error as Error);
      }
    }

    this.processing = false;
  }
}
