import React from 'react';

export default function RootLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-[#faf8f5]">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-amber-200 animate-ping opacity-25" />
        <div className="w-16 h-16 rounded-full border-4 border-amber-600 border-t-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-lg">
          🏛️
        </div>
      </div>
      <h3 className="font-serif font-bold text-stone-900 text-lg">Exploring Delhi...</h3>
      <p className="text-xs text-stone-500 mt-1">Discovering heritage, culture, and stories.</p>
    </div>
  );
}
