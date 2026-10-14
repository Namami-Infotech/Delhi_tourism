import React from 'react';
import { cn } from '../../lib/utils';

export default function Card({
  children,
  className = '',
  hoverEffect = true,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden transition-all duration-300',
        hoverEffect && 'hover:shadow-xl hover:border-amber-200/80 hover:-translate-y-1',
        onClick && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={cn('p-6 pb-3', className)}>{children}</div>;
}

export function CardBody({ children, className = '' }) {
  return <div className={cn('p-6 pt-2', className)}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={cn('p-6 pt-3 border-t border-stone-100 flex items-center justify-between', className)}>{children}</div>;
}
