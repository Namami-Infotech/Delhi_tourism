import React from 'react';
import Link from 'next/link';
import Container from '../layout/Container';
import SectionHeading from '../ui/SectionHeading';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { formatDate } from '../../lib/utils';

export default function UpcomingEventsSection({ events = [] }) {
  if (!events || events.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 bg-white border-t border-stone-100">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <SectionHeading
            eyebrow="Cultural Calendar"
            title="Upcoming Festivals & Events"
            description="Experience live performances, seasonal cultural festivals, traditional music, and visual arts exhibitions."
            align="left"
            className="mb-0"
          />
          <div className="mt-6 sm:mt-0 shrink-0">
            <Button href="/events" variant="outline" size="sm">
              All Festivals & Events →
            </Button>
          </div>
        </div>

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
                      {event.category || 'Cultural Festival'}
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
                    Open to all visitors and travelers
                  </span>
                  <Link
                    href={`/events/${event.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 group-hover:text-primary-700 transition-colors"
                  >
                    <span>Event Details</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
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
