'use client';

import { Button, Tooltip } from '@heroui/react';
import { RotateCcw } from 'lucide-react';
import { ReactNode, memo } from 'react';

interface FieldRowProps {
  description?: string;
  children: ReactNode;
  isModified?: boolean;
  onReset?: () => void;
}

const FieldRow = memo(function FieldRow({
  description,
  children,
  isModified = false,
  onReset,
}: FieldRowProps) {
  return (
    <Tooltip
      content={description || ''}
      placement="left"
      delay={500}
      radius="sm"
      triggerScaleOnOpen={false}
    >
      <div className="grid grid-cols-[20px_1fr_20px] items-center gap-3 px-2 py-1 hover:bg-default-100 group">
        {/* Indicator */}
        <div className="w-5 shrink-0 flex justify-center">
          {isModified && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
        </div>

        {/* Field */}
        {children}

        {/* Reset */}
        <div className="w-5 shrink-0 flex justify-center">
          {isModified && onReset && (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={onReset}
              className="visible w-4 h-4 min-w-4"
            >
              <RotateCcw size={10} />
            </Button>
          )}
        </div>
      </div>
    </Tooltip>
  );
});

export default FieldRow;
