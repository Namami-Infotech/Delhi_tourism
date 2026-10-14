import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Container from '../../../components/layout/Container';
import Breadcrumbs from '../../../components/navigation/Breadcrumbs';
import SectionHeading from '../../../components/ui/SectionHeading';
import Badge from '../../../components/ui/Badge';
import Card from '../../../components/ui/Card';
import MapComponent from '../../../components/maps/MapComponent';
import ImageGallery from '../../../components/gallery/ImageGallery';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function generateMetadata({ params }) {
  try {
    const res = await fetch(`${API_BASE_URL}/itineraries/${params.slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return { title: 'Itinerary | Delhi Tourism' };
    const json = await res.json();
    const it = json?.data;
    const title = `${it?.title || 'Itinerary'} | Delhi Tourism`;
    const description = it?.description || `Explore ${it?.title} in Delhi.`;
    const image = it?.coverImage;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        ...(image ? { images: [{ url: image, alt: it?.title }] } : {}),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        ...(image ? { images: [image] } : {}),
      },
    };
  } catch {
    return { title: 'Itinerary | Delhi Tourism' };
  }
}

async function getItinerary(slug) {
  try {
    const res = await fetch(`${API_BASE_URL}/itineraries/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

export default async function ItineraryDetailPage({ params }) {
  const itinerary = await getItinerary(params.slug);

  if (!itinerary) {
    notFound();
  }

  const stops = itinerary.stops || [];
  const days = [...new Set(stops.map((s) => s.day))].sort((a, b) => a - b);

  const mapMarkers = stops
    .filter((s) => s.place && s.place.latitude && s.place.longitude)
    .map((s) => ({
      lat: parseFloat(s.place.latitude),
      lng: parseFloat(s.place.longitude),
      title: s.place.name,
      address: s.place.address,
    }));

  return (
    <div className="py-10 bg-[#faf8f5] min-h-screen">
      <Container>
        <Breadcrumbs
          items={[
            { label: 'Itineraries', href: '/itineraries' },
            { label: itinerary.title },
          ]}
        />

        {/* Title Header */}
        <div className="py-8 border-b border-stone-200">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="gold" size="sm">
              ⏱️ Duration: {itinerary.duration || 'Multi-Day'}
            </Badge>
            <Badge variant="default" size="sm" className="bg-stone-200 text-stone-800">
              {stops.length} Planned Destinations
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-stone-900 tracking-tight mb-4">
            {itinerary.title}
          </h1>
          <p className="text-stone-700 text-base sm:text-lg max-w-3xl font-light leading-relaxed">
            {itinerary.description}
          </p>
        </div>

        {/* Day-by-Day Timeline Breakdown */}
        <div className="py-12 space-y-12">
          {days.map((dayNum) => {
            const dayStops = stops.filter((s) => s.day === dayNum);

            return (
              <div key={dayNum} className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-600 text-white font-serif font-bold text-lg flex items-center justify-center shadow-sm">
                    {dayNum}
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-2xl text-stone-900">
                      Day 0{dayNum} Schedule
                    </h2>
                    <span className="text-xs text-stone-500 font-medium">
                      {dayStops.length} stops scheduled
                    </span>
                  </div>
                </div>

                <div className="space-y-4 pl-4 sm:pl-6 border-l-2 border-primary-200">
                  {dayStops.map((stop, idx) => (
                    <Card key={stop.id || idx} className="p-6 bg-white hover:border-amber-300 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center">
                              {stop.sequence || idx + 1}
                            </span>
                            <h3 className="font-serif font-bold text-xl text-stone-900">
                              {stop.place?.name || `Stop ${idx + 1}`}
                            </h3>
                          </div>

                          {stop.place?.locality && (
                            <p className="text-xs text-stone-500">
                              📍 {stop.place.locality}
                            </p>
                          )}

                          {stop.place?.shortDescription && (
                            <p className="text-stone-600 text-sm leading-relaxed max-w-2xl">
                              {stop.place.shortDescription}
                            </p>
                          )}

                          {stop.notes && (
                            <div className="p-3 rounded-lg bg-amber-50/70 text-amber-900 text-xs mt-2 border border-amber-200/50">
                              <span className="font-bold">Insider Tip:</span> {stop.notes}
                            </div>
                          )}
                        </div>

                        <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-2 sm:pt-0">
                          {stop.estimatedDuration && (
                            <Badge variant="gold" size="sm">
                              ⏱️ {stop.estimatedDuration}
                            </Badge>
                          )}

                          {stop.place?.slug && (
                            <Link
                              href={`/places/${stop.place.slug}`}
                              className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline"
                            >
                              Destination Details →
                            </Link>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Map Route View */}
        {mapMarkers.length > 0 && (
          <div className="py-12 border-t border-stone-200">
            <SectionHeading
              eyebrow="Route Map"
              title="Itinerary Waypoints"
              align="left"
            />
            <MapComponent
              title={itinerary.title}
              markers={mapMarkers}
              latitude={mapMarkers[0]?.lat}
              longitude={mapMarkers[0]?.lng}
            />
          </div>
        )}

        {/* Gallery */}
        {itinerary.galleries && itinerary.galleries.length > 0 && (
          <div className="py-12 border-t border-stone-200">
            <ImageGallery images={itinerary.galleries} title="Itinerary Visuals" />
          </div>
        )}
      </Container>
    </div>
  );
}
