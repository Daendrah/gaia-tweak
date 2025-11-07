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

      let commandResolve!: () => void;
      let commandReject!: (error: Error) => void;

      const commandPromise = new Promise<void>((res, rej) => {
        commandResolve = res;
        commandReject = rej;
      });

      try {
        for (let i = 0; i < command.steps.length; i++) {
          const step = command.steps[i];

          this.updateState({
            componentName: command.componentName,
            stepName: step.name,
            promise: commandPromise,
          });

          await step.execute(context);
        }

        commandResolve();
        resolve();
      } catch (error) {
        console.error(`Generation command failed for ${command.componentName}:`, error);

        commandReject(error as Error);
        reject(error as Error);
      }
    }

    this.processing = false;
  }
}
