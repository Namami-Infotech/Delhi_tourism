import React from 'react';
import Link from 'next/link';
import Container from '../layout/Container';
import SectionHeading from '../ui/SectionHeading';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function SuggestedItinerariesSection({ itineraries = [] }) {
  if (!itineraries || itineraries.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 bg-[#faf8f5]">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <SectionHeading
            eyebrow="Curated Journeys"
            title="Suggested Delhi Itineraries"
            description="Optimize your visit with carefully timed day-by-day itineraries designed by local heritage and travel experts."
            align="left"
            className="mb-0"
          />
          <div className="mt-6 sm:mt-0 shrink-0">
            <Button href="/itineraries" variant="outline" size="sm">
              All Itineraries →
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {itineraries.map((itinerary) => {
            const stops = itinerary.stops || [];
            const day1Stops = stops.filter((s) => s.day === 1);
            const day2Stops = stops.filter((s) => s.day === 2);

            return (
              <Card key={itinerary.id} className="p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <Badge variant="gold" size="md">
                      ⏱️ {itinerary.duration || '2 Days'}
                    </Badge>
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                      {stops.length} Planned Stops
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 mb-3">
                    {itinerary.title}
                  </h3>

                  <p className="text-stone-600 text-sm leading-relaxed mb-6">
                    {itinerary.description}
                  </p>

                  {/* Stops preview */}
                  {stops.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-stone-100">
                      {day1Stops.length > 0 && (
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                            Day 1 Highlights
                          </span>
                          <div className="mt-2.5 flex flex-wrap gap-2">
                            {day1Stops.map((stop, sIdx) => (
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
                          </div>
                        </div>
                      )}

                      {day2Stops.length > 0 && (
                        <div className="pt-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-stone-700 bg-stone-100 px-2.5 py-1 rounded-md">
                            Day 2 Highlights
                          </span>
                          <div className="mt-2.5 flex flex-wrap gap-2">
                            {day2Stops.map((stop, sIdx) => (
                              <span
                                key={sIdx}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 text-stone-800 text-xs font-medium"
                              >
                                <span className="w-4 h-4 rounded-full bg-stone-200 text-stone-700 text-[10px] font-bold flex items-center justify-center">
                                  {stop.sequence || sIdx + 1}
                                </span>
                                {stop.place?.name || `Stop ${sIdx + 1}`}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-500">
                    Step-by-step route with recommended timings
                  </span>
                  <Link
                    href={`/itineraries/${itinerary.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    <span>View Full Itinerary</span>
                    <span>→</span>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
