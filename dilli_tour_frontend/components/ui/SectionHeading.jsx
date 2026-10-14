import React from 'react';
import { cn } from '../../lib/utils';

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className = '',
  light = false,
}) {
  const alignment = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  };

  return (
    <div className={cn('flex flex-col max-w-3xl mb-12', alignment[align] || alignment.center, className)}>
      {eyebrow && (
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-px bg-primary-500" />
          <span className={cn(
            'text-xs uppercase tracking-widest font-bold',
            light ? 'text-amber-300' : 'text-primary-600'
          )}>
            {eyebrow}
          </span>
          <span className="w-6 h-px bg-primary-500" />
        </div>
      )}
      {title && (
        <h2 className={cn(
          'text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight',
          light ? 'text-white' : 'text-stone-900'
        )}>
          {title}
        </h2>
      )}
      {description && (
        <p className={cn(
          'mt-4 text-base sm:text-lg leading-relaxed text-balance',
          light ? 'text-stone-300' : 'text-stone-600'
        )}>
          {description}
        </p>
      )}
    </div>
  );
}
