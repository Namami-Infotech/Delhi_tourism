import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { getPlaceCover } from '../../lib/placeImages';

export default function PlaceCard({ place }) {
  const imageUrl = getPlaceCover(place);
  const features = place.features?.slice(0, 3) || [];

  return (
    <Link href={`/places/${place.slug}`} className="group block h-full">
      <Card className="h-full flex flex-col group-hover:border-amber-300">
        {/* Destination Image */}
        <div className="relative h-56 w-full overflow-hidden bg-stone-100">
          <Image
            src={imageUrl}
            alt={place.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />

          {/* Top badges: Locality & Featured */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <Badge variant="default" size="sm" className="bg-black/50 text-white border-white/20 backdrop-blur-md">
              📍 {place.locality || 'Delhi'}
            </Badge>
            {place.isFeatured && (
              <Badge variant="featured" size="sm">
                ⭐ Featured
              </Badge>
            )}
          </div>

          {/* Place Name on Image */}
          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="font-serif font-bold text-xl text-white group-hover:text-amber-300 transition-colors">
              {place.name}
            </h3>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 flex flex-col justify-between bg-white">
          <div>
            {/* Feature Tags */}
            {features.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {features.map((f, idx) => (
                  <Badge key={idx} variant="heritage" size="sm">
                    {f.feature || f}
                  </Badge>
                ))}
              </div>
            )}

            <p className="text-stone-600 text-sm leading-relaxed line-clamp-2 mb-4">
              {place.shortDescription || place.description}
            </p>
          </div>

          {/* Timings and Action footer */}
          <div className="pt-3 border-t border-stone-100 flex flex-col gap-1 text-xs text-stone-500">
            {place.openDays && (
              <span className="text-stone-600 font-medium truncate" title={place.openDays}>
                📅 {place.openDays}
              </span>
            )}
            <div className="flex items-center justify-between">
              <span>
                {place.openingTime && place.closingTime
                  ? `🕒 ${place.openingTime} – ${place.closingTime}`
                  : 'Open Daily'}
              </span>
              <span className="font-semibold text-primary-600 group-hover:text-primary-700 inline-flex items-center gap-1">
                <span>View Details</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
