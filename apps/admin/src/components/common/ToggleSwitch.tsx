'use client';

import React from 'react';
import { cn } from '@repo/ui';

interface ToggleProps extends Omit<
  React.ComponentPropsWithRef<'button'>,
  'onChange'
> {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
}

const ToggleSwitch = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ enabled, onChange, label, disabled, className, ...props }, ref) => {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <button
          {...props}
          ref={ref}
          type="button"
          disabled={disabled}
          onClick={() => onChange(!enabled)}
          className={cn(
            'relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            enabled ? 'bg-primary-500' : 'bg-gray-300',
          )}
        >
          <span
            className={cn(
              'inline-block h-6 w-6 transform rounded-full bg-white transition duration-200 ease-in-out',
              enabled ? 'translate-x-7' : 'translate-x-1',
            )}
          />
        </button>
        {label && (
          <span className={cn('body3 text-black', disabled && 'opacity-50')}>
            {label}
          </span>
        )}
      </div>
    );
  },
);

ToggleSwitch.displayName = 'ToggleSwitch';

export default ToggleSwitch;
