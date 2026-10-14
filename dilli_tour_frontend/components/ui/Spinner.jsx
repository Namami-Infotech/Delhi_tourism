import React from 'react';
import { cn } from '../../lib/utils';

export default function Spinner({ size = 'md', className = '', color = 'text-primary-500' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block animate-spin rounded-full border-current border-t-transparent',
        sizes[size] || sizes.md,
        color,
        className
      )}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
