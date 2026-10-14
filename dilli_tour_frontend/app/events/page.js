import React from 'react';
import Link from 'next/link';
import Container from '../../components/layout/Container';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import SectionHeading from '../../components/ui/SectionHeading';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import { formatDate } from '../../lib/utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const metadata = {
  title: 'Cultural Festivals & Events | Delhi Tourism',
  description: 'Discover upcoming festivals, music celebrations, dance performances, and art exhibitions across Delhi.',
};

async function getEvents() {
  try {
    const res = await fetch(`${API_BASE_URL}/events`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch {
    return [];
  }
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="py-10 bg-[#faf8f5] min-h-screen">
      <Container>
        <Breadcrumbs items={[{ label: 'Events' }]} />

        <div className="py-8">
          <SectionHeading
            eyebrow="Cultural Happenings"
            title="Festivals & Events in Delhi"
            description="Explore ongoing and upcoming celebrations, classical concerts, artisan fairs, and theatre performances."
            align="left"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event) => {
              const start = event.startDate ? formatDate(event.startDate, { month: 'short', day: 'numeric', year: 'numeric' }) : '';
              const end = event.endDate ? formatDate(event.endDate, { month: 'short', day: 'numeric', year: 'numeric' }) : '';
              const dateStr = end ? `${start} – ${end}` : start;

              return (
                <Card key={event.id} className="p-6 sm:p-7 flex flex-col justify-between group hover:border-amber-300">
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <Badge variant="accent" size="sm">
                        {event.category || 'Cultural Event'}
                      </Badge>
                      <span className="text-xs font-semibold text-stone-500">
                        📅 {dateStr}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-2xl text-stone-900 group-hover:text-primary-600 transition-colors mb-2">
                      {event.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-4">
                      <span>📍</span>
                      <span>{event.venue || 'Delhi Venue'}</span>
                      {event.address && (
                        <>
                          <span>•</span>
                          <span className="truncate">{event.address}</span>
                        </>
                      )}
                    </div>

                    <p className="text-stone-600 text-sm leading-relaxed line-clamp-3">
                      {event.description}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs text-stone-500">
                      Open to general public
                    </span>
                    <Link
                      href={`/events/${event.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 group-hover:text-primary-700"
                    >
                      <span>Event Details</span>
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
