'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    // Error logged or sent to monitoring service if configured
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#faf8f5]">
      <div className="w-16 h-16 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-2xl mb-4 text-rose-700">
        ⚠️
      </div>
      <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">
        Something went wrong
      </h2>
      <p className="text-xs text-stone-600 max-w-md mx-auto mb-6">
        An error occurred while loading tourism information. Please try refreshing or return to the home page.
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-4 py-2 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs rounded-xl border border-stone-200 shadow-2xs transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
