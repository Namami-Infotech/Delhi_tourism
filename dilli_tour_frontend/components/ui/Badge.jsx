import React from 'react';
import { cn } from '../../lib/utils';

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon,
}) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full shrink-0 tracking-wide';

  const variants = {
    default: 'bg-gray-100 text-gray-800 border border-gray-200/60',
    primary: 'bg-primary-50 text-primary-700 border border-primary-200',
    gold: 'bg-amber-50 text-amber-800 border border-amber-200/80',
    accent: 'bg-sky-50 text-sky-700 border border-sky-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    heritage: 'bg-[#faf0e6] text-[#8b3a1a] border border-[#ecd5c4]',
    spiritual: 'bg-[#f5eef8] text-[#6c3483] border border-[#e8daef]',
    featured: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-xs',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  return (
    <span className={cn(baseStyles, variants[variant] || variants.default, sizes[size] || sizes.md, className)}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
