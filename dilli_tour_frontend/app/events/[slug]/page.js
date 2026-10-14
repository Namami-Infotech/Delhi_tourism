import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Container from '../../../components/layout/Container';
import Breadcrumbs from '../../../components/navigation/Breadcrumbs';
import SectionHeading from '../../../components/ui/SectionHeading';
import Badge from '../../../components/ui/Badge';
import Card from '../../../components/ui/Card';
import MapComponent from '../../../components/maps/MapComponent';
import ImageGallery from '../../../components/gallery/ImageGallery';
import { formatDate } from '../../../lib/utils';
import { DEFAULT_HERO_IMAGE } from '../../../lib/placeImages';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function generateMetadata({ params }) {
  try {
    const res = await fetch(`${API_BASE_URL}/events/${params.slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return { title: 'Event | Delhi Tourism' };
    const json = await res.json();
    const event = json?.data;
    const title = `${event?.title || 'Event'} | Delhi Tourism`;
    const description = event?.description || `Discover ${event?.title} in Delhi.`;
    const image = event?.coverImage;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        ...(image ? { images: [{ url: image, alt: event?.title }] } : {}),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        ...(image ? { images: [image] } : {}),
      },
    };
  } catch {
    return { title: 'Event | Delhi Tourism' };
  }
}

async function getEvent(slug) {
  try {
    const res = await fetch(`${API_BASE_URL}/events/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

export default async function EventDetailPage({ params }) {
  const event = await getEvent(params.slug);

  if (!event) {
    notFound();
  }

  const start = event.startDate ? formatDate(event.startDate, { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  const end = event.endDate ? formatDate(event.endDate, { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  const dateStr = end ? `${start} – ${end}` : start;
  const coverImage = event.coverImage || DEFAULT_HERO_IMAGE;

  return (
    <div className="bg-[#faf8f5] min-h-screen">
      {/* Event Hero */}
      <div className="relative h-[45vh] sm:h-[50vh] min-h-[350px] w-full bg-stone-950 overflow-hidden flex items-end">
        <Image
          src={coverImage}
          alt={event.title}
          fill
          priority
          className="object-cover opacity-60"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />

        <Container className="relative z-10 pb-10 sm:pb-14">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="accent" size="sm">
              {event.category || 'Festival & Event'}
            </Badge>
            {event.isFeatured && (
              <Badge variant="featured" size="sm">
                ⭐ Featured Event
              </Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-black text-white tracking-tight mb-2">
            {event.title}
          </h1>

          <p className="text-amber-300 text-sm sm:text-base font-medium">
            📅 {dateStr}
          </p>
        </Container>
      </div>

      <Container className="py-8">
        <Breadcrumbs
          items={[
            { label: 'Events', href: '/events' },
            { label: event.title },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 py-8 border-b border-stone-200">
          {/* Main Description */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900">
              About the Event
            </h2>
            <div className="text-stone-700 text-base sm:text-lg leading-relaxed font-light space-y-4">
              <p>{event.description}</p>
            </div>

            {/* Gallery */}
            {event.galleries && event.galleries.length > 0 && (
              <div className="pt-6">
                <ImageGallery images={event.galleries} title="Event Photos" />
              </div>
            )}
          </div>

          {/* Sidebar Venue & Dates */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white space-y-5">
              <h3 className="font-serif font-bold text-xl text-stone-900 pb-3 border-b border-stone-100">
                Key Event Info
              </h3>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-stone-400 block mb-1">
                    Event Dates
                  </span>
                  <p className="font-medium text-stone-900">{dateStr}</p>
                </div>

                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-stone-400 block mb-1">
                    Venue
                  </span>
                  <p className="font-medium text-stone-900">{event.venue || 'Delhi, India'}</p>
                  {event.address && (
                    <p className="text-xs text-stone-500 mt-0.5">{event.address}</p>
                  )}
                </div>

                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-stone-400 block mb-1">
                    Category
                  </span>
                  <p className="font-medium text-stone-900">{event.category || 'Cultural Arts'}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Venue Map */}
        <div className="py-12">
          <SectionHeading
            eyebrow="Venue Location"
            title="Directions to Venue"
            align="left"
          />
          <MapComponent
            title={event.venue || event.title}
            address={event.address || `${event.venue}, Delhi, India`}
          />
        </div>
      </Container>
    </div>
  );
}
