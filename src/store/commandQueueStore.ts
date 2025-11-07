import { create } from 'zustand';

import { GenerationScheduler } from '@/lib/generation/scheduler';
import { GenerationCommand, CommandContext, CommandStatus } from '@/types/generationTypes';

interface CommandQueueState {
  queueStatus: CommandStatus | null;
  submitCommand: (command: GenerationCommand, context: CommandContext) => Promise<void>;
}

let queueInstance: GenerationScheduler | null = null;

export const useCommandQueueStore = create<CommandQueueState>(set => {
  if (!queueInstance) {
    queueInstance = new GenerationScheduler((status: CommandStatus | null) => {
      set({ queueStatus: status });
    });
  }

  return {
    queueStatus: null,

    submitCommand: async (command: GenerationCommand, context: CommandContext): Promise<void> => {
      if (!queueInstance) {
        throw new Error('Command queue not initialized');
      }
      return queueInstance.submit(command, context);
    },
  };
});
