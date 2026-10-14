import React from 'react';
import Link from 'next/link';

export default function Breadcrumbs({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="py-3 text-xs sm:text-sm text-stone-500">
      <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2">
        <li>
          <Link href="/" className="hover:text-primary-600 transition-colors flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-stone-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={item.label || index}>
              <li className="text-stone-300">/</li>
              <li>
                {isLast || !item.href ? (
                  <span className="font-medium text-stone-800" aria-current={isLast ? 'page' : undefined}>
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="hover:text-primary-600 transition-colors">
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
