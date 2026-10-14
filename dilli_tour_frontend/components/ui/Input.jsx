import React from 'react';
import { cn } from '../../lib/utils';

export default function Input({
  label,
  id,
  type = 'text',
  error,
  helperText,
  icon,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-stone-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative rounded-lg shadow-2xs">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            {icon}
          </div>
        )}
        <input
          id={id}
          type={type}
          className={cn(
            'block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-stone-900 transition-colors placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-offset-1',
            icon && 'pl-10',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-stone-300 focus:border-primary-500 focus:ring-primary-100',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {!error && helperText && <p className="mt-1 text-xs text-stone-500">{helperText}</p>}
    </div>
  );
}
