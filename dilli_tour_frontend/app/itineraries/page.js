import React from 'react';
import Link from 'next/link';
import Container from '../../components/layout/Container';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import SectionHeading from '../../components/ui/SectionHeading';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const metadata = {
  title: 'Suggested Itineraries | Delhi Tourism',
  description: 'Curated travel itineraries for exploring Delhi: 1-day, 2-day, and weekend travel schedules.',
};

async function getItineraries() {
  try {
    const res = await fetch(`${API_BASE_URL}/itineraries`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch {
    return [];
  }
}

export default async function ItinerariesPage() {
  const itineraries = await getItineraries();

  return (
    <div className="py-10 bg-[#faf8f5] min-h-screen">
      <Container>
        <Breadcrumbs items={[{ label: 'Itineraries' }]} />

        <div className="py-8">
          <SectionHeading
            eyebrow="Travel Schedules"
            title="Suggested Delhi Itineraries"
            description="Maximize your time in Delhi with carefully planned routes connecting major monuments, dining stops, and cultural markets."
            align="left"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {itineraries.map((itinerary) => {
              const stops = itinerary.stops || [];
              return (
                <Card key={itinerary.id} className="p-6 sm:p-8 flex flex-col justify-between group hover:border-amber-300">
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <Badge variant="gold" size="md">
                        ⏱️ {itinerary.duration || 'Multi-Day'}
                      </Badge>
                      <span className="text-xs font-semibold text-stone-500">
                        {stops.length} Stops Planned
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 group-hover:text-primary-600 transition-colors mb-3">
                      {itinerary.title}
                    </h3>

                    <p className="text-stone-600 text-sm leading-relaxed mb-6">
                      {itinerary.description}
                    </p>

                    {/* Preview of stops */}
                    {stops.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-stone-100">
                        {stops.slice(0, 4).map((stop, sIdx) => (
                          <span
                            key={sIdx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 text-stone-800 text-xs font-medium"
                          >
                            <span className="w-4 h-4 rounded-full bg-primary-100 text-primary-700 text-[10px] font-bold flex items-center justify-center">
                              {stop.sequence || sIdx + 1}
                            </span>
                            {stop.place?.name || `Stop ${sIdx + 1}`}
                          </span>
                        ))}
                        {stops.length > 4 && (
                          <span className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-stone-50 text-stone-500 text-xs">
                            +{stops.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs text-stone-500">
                      Step-by-step route and advice
                    </span>
                    <Link
                      href={`/itineraries/${itinerary.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 group-hover:text-primary-700"
                    >
                      <span>Explore Schedule</span>
                      <span>→</span>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
}
