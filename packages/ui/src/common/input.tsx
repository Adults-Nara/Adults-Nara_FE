'use client';

import React from 'react';
import { cn } from '../utils/cn';
import { Close, View, ViewHide } from '../icons';

export interface InputProps extends React.ComponentProps<'input'> {
  leftIcon?: React.ReactNode;
  onClear?: () => void;
  showClear?: boolean;
  error?: boolean;
  errorMessage?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      leftIcon,
      onClear,
      showClear,
      error,
      errorMessage,
      value,
      onChange,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const togglePassword = () => setShowPassword((prev) => !prev);

    return (
      <div className="flex w-full flex-col gap-1.5">
        <div
          className={cn(
            'group flex h-[50px] w-full items-center gap-2 rounded-lg border border-gray-500 bg-gray-200 px-5 focus-within:border-gray-900',
            error && 'border-red-500 focus-within:border-red-500',
            props.disabled && 'cursor-not-allowed opacity-50',
            className,
          )}
        >
          {leftIcon && <div className="text-gray-700">{leftIcon}</div>}
          <input
            type={inputType}
            value={value}
            onChange={onChange}
            className="body2 flex-1 py-2 outline-none placeholder:text-gray-600 disabled:cursor-not-allowed"
            ref={ref}
            {...props}
          />
          <div className="flex items-center gap-1.5">
            {showClear &&
              value !== undefined &&
              value !== '' &&
              !isPassword && (
                <button type="button" onClick={onClear}>
                  <Close />
                </button>
              )}

            {isPassword && (
              <button
                type="button"
                onClick={togglePassword}
                className="text-gray-700"
              >
                {showPassword ? (
                  <ViewHide className="h-5 w-5" />
                ) : (
                  <View className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
        </div>

        {error && errorMessage && (
          <p className="body3 px-3 text-red-500">{errorMessage}</p>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
