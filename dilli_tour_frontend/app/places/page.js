import React from 'react';
import Link from 'next/link';
import Container from '../../components/layout/Container';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import PlaceCard from '../../components/places/PlaceCard';
import SectionHeading from '../../components/ui/SectionHeading';
import { PLACE_FEATURES } from '../../lib/constants';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const metadata = {
  title: 'Tourist Places & Monuments | Delhi Tourism',
  description: 'Explore the iconic monuments, historical citadels, sacred shrines, and vibrant markets of Delhi.',
};

async function getPlaces(searchParams) {
  try {
    const query = new URLSearchParams();
    if (searchParams?.locality) query.set('locality', searchParams.locality);
    if (searchParams?.feature) query.set('feature', searchParams.feature);
    if (searchParams?.featured) query.set('featured', searchParams.featured);

    const queryString = query.toString();
    const endpoint = queryString ? `/places?${queryString}` : '/places';

    const res = await fetch(`${API_BASE_URL}${endpoint}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch {
    return [];
  }
}

export default async function PlacesPage({ searchParams }) {
  const places = await getPlaces(searchParams);
  const currentFeature = searchParams?.feature || '';
  const currentLocality = searchParams?.locality || '';

  return (
    <div className="py-10 bg-[#faf8f5] min-h-screen">
      <Container>
        <Breadcrumbs items={[{ label: 'Places' }]} />

        <div className="py-8">
          <SectionHeading
            eyebrow="Destinations"
            title="All Tourist Places in Delhi"
            description="From world-famous UNESCO World Heritage sites to hidden stepwells, explore Delhi's rich spectrum of monuments, shrines, and cultural hubs."
            align="left"
          />

          {/* Filter Bar */}
          <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-2xs mb-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs uppercase font-bold tracking-wider text-stone-500">
                Filter By Feature Tag:
              </span>
              {(currentFeature || currentLocality) && (
                <Link
                  href="/places"
                  className="text-xs text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Clear All Filters ✕
                </Link>
              )}
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2">
              <Link
                href="/places"
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  !currentFeature
                    ? 'bg-primary-600 text-white font-semibold'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                All Features
              </Link>
              {PLACE_FEATURES.map((feature) => {
                const isActive = currentFeature === feature;
                return (
                  <Link
                    key={feature}
                    href={isActive ? '/places' : `/places?feature=${encodeURIComponent(feature)}`}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-600 text-white font-semibold'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {feature}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Places Results Grid */}
          {places.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {places.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-white rounded-2xl border border-stone-200 p-8">
              <span className="text-4xl mb-3 block">🏛️</span>
              <h3 className="font-serif font-bold text-xl text-stone-900 mb-1">
                No destinations match this filter
              </h3>
              <p className="text-sm text-stone-500 mb-4">
                Try clearing the filter tag or browsing all destinations.
              </p>
              <Link
                href="/places"
                className="inline-flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold rounded-lg"
              >
                Reset Filters
              </Link>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
