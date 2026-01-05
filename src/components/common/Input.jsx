import { forwardRef } from 'react';
import { cn } from '../../utils/helpers';

export const Input = forwardRef(function Input(
  { label, error, helperText, className, ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full px-3 py-2 rounded-lg border bg-white text-gray-900 placeholder-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'transition-all duration-200',
          'dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500',
          error
            ? 'border-danger-500 focus:ring-danger-500'
            : 'border-gray-300',
          className
        )}
        {...props}
      />
      {(error || helperText) && (
        <p
          className={cn(
            'mt-1 text-sm',
            error ? 'text-danger-500' : 'text-gray-500 dark:text-gray-400'
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
});

export const Select = forwardRef(function Select(
  { label, error, helperText, options, placeholder, className, ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          'w-full px-3 py-2 rounded-lg border bg-white text-gray-900',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'transition-all duration-200',
          'dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100',
          error
            ? 'border-danger-500 focus:ring-danger-500'
            : 'border-gray-300',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {(error || helperText) && (
        <p
          className={cn(
            'mt-1 text-sm',
            error ? 'text-danger-500' : 'text-gray-500 dark:text-gray-400'
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
});

export const Textarea = forwardRef(function Textarea(
  { label, error, helperText, className, ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn(
          'w-full px-3 py-2 rounded-lg border bg-white text-gray-900 placeholder-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'transition-all duration-200 resize-none',
          'dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500',
          error
            ? 'border-danger-500 focus:ring-danger-500'
            : 'border-gray-300',
          className
        )}
        {...props}
      />
      {(error || helperText) && (
        <p
          className={cn(
            'mt-1 text-sm',
            error ? 'text-danger-500' : 'text-gray-500 dark:text-gray-400'
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
});
