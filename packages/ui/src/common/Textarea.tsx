'use client';

import React from 'react';
import { cn } from '../utils/cn';

export interface TextareaProps extends React.ComponentProps<'textarea'> {
  error?: boolean;
  errorMessage?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, errorMessage, value, onChange, ...props }, ref) => {
    return (
      <div className="flex w-full flex-col gap-1.5">
        <div
          className={cn(
            'group flex min-h-[95px] w-full items-center gap-4 rounded-lg border border-gray-500 bg-gray-200 px-5 py-3 focus-within:border-gray-900',
            error && 'border-red-500 focus-within:border-red-500',
            props.disabled && 'cursor-not-allowed opacity-50',
            className,
          )}
        >
          <textarea
            value={value}
            onChange={onChange}
            className="body2 h-full w-full resize-none bg-transparent outline-none placeholder:text-gray-600 disabled:cursor-not-allowed"
            ref={ref}
            {...props}
          />
        </div>

        {error && errorMessage && (
          <p className="body3 px-3 text-red-500">{errorMessage}</p>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
