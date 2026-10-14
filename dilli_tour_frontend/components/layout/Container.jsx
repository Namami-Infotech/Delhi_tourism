import React from 'react';
import { cn } from '../../lib/utils';

export default function Container({
  children,
  className = '',
  size = 'default',
  ...props
}) {
  const sizes = {
    narrow: 'max-w-5xl',
    default: 'max-w-7xl',
    wide: 'max-w-8xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8 w-full',
        sizes[size] || sizes.default,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
