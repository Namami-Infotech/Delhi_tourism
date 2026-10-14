'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Button from '../ui/Button';
import GlobalSearchModal from '../search/GlobalSearchModal';
import { DEFAULT_HERO_IMAGE } from '../../lib/placeImages';

export default function Hero() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="relative min-h-[90vh] lg:min-h-[94vh] flex items-center justify-center overflow-hidden bg-stone-950 text-white">
      {/* Background Image with Parallax & Gradients */}
      <div className="absolute inset-0 z-0">
        <Image
          src={DEFAULT_HERO_IMAGE}
          alt="Majestic Delhi Monument"
          fill
          priority
          className="object-cover object-center scale-105 animate-in fade-in zoom-in-105 duration-1000 opacity-65"
          sizes="100vw"
        />
        {/* Multilayered Cultural Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-stone-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-transparent to-stone-950/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,10,5,0.6)_100%)]" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center flex flex-col items-center">
        {/* Cultural Eyebrow */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs sm:text-sm font-medium tracking-wide uppercase mb-6 shadow-lg animate-in fade-in slide-in-from-bottom-3 duration-700">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>The Official Delhi Tourism Experience • दिल वालों की दिल्ली</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight max-w-5xl leading-[1.1] text-balance mb-6 text-white text-shadow-lg">
          Where Centuries of <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">Heritage</span> Meet Modern Spirit
        </h1>

        {/* Supporting Narrative */}
        <p className="text-base sm:text-xl text-stone-200 max-w-3xl leading-relaxed font-light mb-10 text-balance text-shadow">
          Journey through imperial citadels, sacred shrines, bustling centuries-old bazaars, and world-class cultural sanctuaries across India&apos;s timeless capital.
        </p>

        {/* Interactive Quick Discovery Bar */}
        <div className="w-full max-w-2xl mb-10">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between p-2.5 sm:p-3 bg-white/95 hover:bg-white text-stone-800 rounded-2xl shadow-2xl backdrop-blur-md border border-white/30 transition-all hover:scale-[1.01] group text-left"
            aria-label="Open search dialog"
          >
            <div className="flex items-center gap-3.5 pl-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-primary-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs uppercase font-bold tracking-wider text-stone-400">Search Destinations</span>
                <span className="text-sm font-medium text-stone-700 group-hover:text-stone-900">
                  Where would you like to explore in Delhi?
                </span>
              </div>
            </div>
            <div className="hidden sm:inline-flex items-center px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold shadow-xs">
              Explore
            </div>
          </button>
        </div>

        {/* Primary and Secondary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            href="/places"
            variant="primary"
            size="lg"
            className="shadow-xl shadow-amber-500/20"
            icon={<span>🏛️</span>}
          >
            Explore Delhi
          </Button>

          <Button
            href="/circuits"
            variant="secondary"
            size="lg"
            className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-md shadow-xl"
            icon={<span>🧭</span>}
          >
            Discover Circuits
          </Button>

          <Button
            href="/itineraries"
            variant="ghost"
            size="lg"
            className="text-stone-200 hover:text-white hover:bg-white/10"
          >
            Suggested Itineraries →
          </Button>
        </div>

        {/* Highlights Counter Strip */}
        <div className="mt-16 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12 pt-8 border-t border-white/15 w-full max-w-4xl">
          <div className="flex flex-col items-center">
            <span className="font-serif text-2xl sm:text-3xl font-black text-amber-400">8+</span>
            <span className="text-xs uppercase tracking-wider text-stone-300 mt-1">Historic Cities</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-serif text-2xl sm:text-3xl font-black text-amber-400">3</span>
            <span className="text-xs uppercase tracking-wider text-stone-300 mt-1">UNESCO World Heritage</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-serif text-2xl sm:text-3xl font-black text-amber-400">12+</span>
            <span className="text-xs uppercase tracking-wider text-stone-300 mt-1">Curated Circuits</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-serif text-2xl sm:text-3xl font-black text-amber-400">1000+</span>
            <span className="text-xs uppercase tracking-wider text-stone-300 mt-1">Years of Living Faith</span>
          </div>
        </div>
      </div>

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
