'use client';

import { addToast, Spinner } from '@heroui/react';
import { CircleAlert, CircleCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { useCommandQueueStore } from '@/store/commandQueueStore';

function ToastIcon({ promise }: { promise: Promise<void> }) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    promise.then(() => setStatus('success')).catch(() => setStatus('error'));
  }, [promise]);

  if (status === 'success') {
    return <CircleCheck className="w-5 h-5 text-success" />;
  }

  return <CircleAlert className="w-5 h-5 text-danger" />;
}

function ToastDescription({
  promise,
  componentName,
}: {
  promise: Promise<void>;
  componentName: string;
}) {
  const queueStatus = useCommandQueueStore(state => state.queueStatus);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    promise.then(() => setStatus('success')).catch(() => setStatus('error'));
  }, [promise]);

  if (status === 'success') {
    return <>{componentName} generated</>;
  }

  if (status === 'error') {
    return <>Failed to generate {componentName}</>;
  }

  if (queueStatus && queueStatus.promise === promise) {
    return <>{queueStatus.stepName || 'Processing...'}</>;
  }

  return <>Processing...</>;
}

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

      addToast({
        title: componentName,
        classNames: {
          base: 'bg-background',
        },
        description: <ToastDescription promise={promise} componentName={componentName} />,
        icon: <ToastIcon promise={promise} />,
        loadingComponent: (
          <span className="text-primary">
            <Spinner size="sm" />
          </span>
        ),
        promise: promise,
        hideCloseButton: true,
        radius: 'sm',
      });
    }
  }, [queueStatus]);

  return null;
}
