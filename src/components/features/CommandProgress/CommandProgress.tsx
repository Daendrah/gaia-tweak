'use client';

import { toast } from '@heroui/react';
import { useEffect, useRef } from 'react';

import { useCommandQueueStore } from '@/store/commandQueueStore';

export function CommandProgress() {
  const queueStatus = useCommandQueueStore(state => state.queueStatus);
  const previousPromise = useRef<Promise<void> | null>(null);

  useEffect(() => {
    if (!queueStatus?.promise) {
      return;
    }

    const { componentName, promise } = queueStatus;

    if (promise !== previousPromise.current) {
      previousPromise.current = promise;

      toast.promise(promise, {
        loading: 'Processing...',
        success: `${componentName} generated`,
        error: `Failed to generate ${componentName}`,
      });
    }
  }, [queueStatus]);

  return null;
}
