import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Card from '../ui/Card';
import { getCategoryCover } from '../../lib/placeImages';

export default function CategoryCard({ category }) {
  const imageUrl = getCategoryCover(category);

  return (
    <Link href={`/categories/${category.slug}`} className="group block h-full">
      <Card className="h-full flex flex-col group-hover:border-amber-300 transition-all duration-300">
        {/* Cover Image Container */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-100">
          <Image
            src={imageUrl}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />

          {/* Category Icon Badge */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md text-white text-xs font-medium border border-white/20">
            {category.icon || '🏛️'} Category
          </div>

          {/* Title on Overlay */}
          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="font-serif font-bold text-xl text-white group-hover:text-amber-300 transition-colors">
              {category.name}
            </h3>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 flex flex-col justify-between bg-white">
          <p className="text-stone-600 text-sm leading-relaxed line-clamp-3 mb-4">
            {category.shortDescription || category.description || 'Explore curated heritage, spirituality, and cultural destinations in this circuit.'}
          </p>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-primary-600 group-hover:text-primary-700">
            <span>Explore Destinations</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
