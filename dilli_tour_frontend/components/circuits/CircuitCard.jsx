import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { getCircuitCover } from '../../lib/placeImages';

export default function CircuitCard({ circuit }) {
  const imageUrl = getCircuitCover(circuit);
  const placesCount = circuit.places?.length || 0;

  return (
    <Link href={`/circuits/${circuit.slug}`} className="group block h-full">
      <Card className="h-full flex flex-col group-hover:border-amber-300">
        {/* Cover Image Container */}
        <div className="relative h-60 w-full overflow-hidden bg-stone-900">
          <Image
            src={imageUrl}
            alt={circuit.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <Badge variant="gold" size="sm" className="shadow-xs backdrop-blur-md">
              ⏱️ {circuit.duration || 'Full Day'}
            </Badge>
            {circuit.bestTime && (
              <Badge variant="default" size="sm" className="bg-black/50 text-white border-white/20 backdrop-blur-md">
                🌤️ {circuit.bestTime}
              </Badge>
            )}
          </div>

          {/* Title & Tagline on Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            {circuit.category?.name && (
              <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-300 block mb-1">
                {circuit.category.name}
              </span>
            )}
            <h3 className="font-serif font-bold text-2xl text-white group-hover:text-amber-300 transition-colors leading-snug">
              {circuit.name}
            </h3>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 flex flex-col justify-between bg-white">
          <div className="space-y-3">
            {circuit.tagline && (
              <p className="text-primary-700 font-serif italic text-sm font-medium">
                &ldquo;{circuit.tagline}&rdquo;
              </p>
            )}
            <p className="text-stone-600 text-sm leading-relaxed line-clamp-3">
              {circuit.shortDescription || circuit.description}
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500 font-medium">
              {placesCount > 0 ? `${placesCount} Destinations Included` : 'Multiple Destinations'}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 group-hover:text-primary-700">
              <span>View Circuit Route</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
