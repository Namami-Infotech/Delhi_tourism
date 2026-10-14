import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center bg-[#faf8f5]">
      <div className="w-20 h-20 rounded-full bg-amber-100/70 border border-amber-200 flex items-center justify-center text-3xl mb-6 shadow-xs">
        🧭
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 mb-3">
        404 — Not Found
      </span>
      <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mb-3">
        Page or Destination Not Found
      </h1>
      <p className="text-sm text-stone-600 max-w-md mx-auto mb-8">
        We couldn&apos;t find the monument, circuit, or page you were looking for. It may have been moved or updated.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
        >
          Return to Home
        </Link>
        <Link
          href="/places"
          className="px-5 py-2.5 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs rounded-xl border border-stone-200 shadow-2xs transition-colors"
        >
          Explore Places
        </Link>
        <Link
          href="/circuits"
          className="px-5 py-2.5 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs rounded-xl border border-stone-200 shadow-2xs transition-colors"
        >
          Discover Circuits
        </Link>
      </div>
    </div>
  );
}
