import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Container from '../../../components/layout/Container';
import Breadcrumbs from '../../../components/navigation/Breadcrumbs';
import MapComponent from '../../../components/maps/MapComponent';
import ImageGallery from '../../../components/gallery/ImageGallery';
import SectionHeading from '../../../components/ui/SectionHeading';
import Badge from '../../../components/ui/Badge';
import Card from '../../../components/ui/Card';
import PlaceCard from '../../../components/places/PlaceCard';
import PlaceFeaturesSection from '../../../components/places/PlaceFeaturesSection';
import { getPlaceCover } from '../../../lib/placeImages';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function generateMetadata({ params }) {
  try {
    const res = await fetch(`${API_BASE_URL}/places/${params.slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return { title: 'Place | Delhi Tourism' };
    const json = await res.json();
    const place = json?.data;
    const title = `${place?.name || 'Place'} | Delhi Tourism`;
    const description = place?.shortDescription || place?.description || `Explore ${place?.name} in Delhi.`;
    const image = place?.coverImage || place?.imageUrl;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        ...(image ? { images: [{ url: image, alt: place?.name }] } : {}),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        ...(image ? { images: [image] } : {}),
      },
    };
  } catch {
    return { title: 'Place | Delhi Tourism' };
  }
}

async function getPlace(slug) {
  try {
    const res = await fetch(`${API_BASE_URL}/places/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

async function getNearbyPlaces(locality, currentSlug) {
  try {
    const endpoint = locality ? `/places?locality=${encodeURIComponent(locality)}` : '/places';
    const res = await fetch(`${API_BASE_URL}${endpoint}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    const items = json?.data || [];
    return items.filter((p) => p.slug !== currentSlug).slice(0, 4);
  } catch {
    return [];
  }
}

export default async function PlaceDetailPage({ params }) {
  const place = await getPlace(params.slug);

  if (!place) {
    notFound();
  }

  const nearbyPlaces = await getNearbyPlaces(place.locality, place.slug);
  const coverImage = getPlaceCover(place);
  const categories = place.categories?.map((c) => c.category).filter(Boolean) || [];
  const circuits = place.circuits?.map((c) => c.circuit).filter(Boolean) || [];
  const features = place.features || [];

  return (
    <div className="bg-[#faf8f5] min-h-screen">
      {/* Place Hero Banner */}
      <div className="relative h-[50vh] sm:h-[60vh] min-h-[420px] w-full bg-stone-950 overflow-hidden flex items-end">
        <Image
          src={coverImage}
          alt={place.name}
          fill
          priority
          className="object-cover opacity-65"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />

        <Container className="relative z-10 pb-10 sm:pb-14">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="default" size="sm" className="bg-white/20 text-white backdrop-blur-md">
              📍 {place.locality || 'Delhi'}
            </Badge>
            {place.isFeatured && (
              <Badge variant="featured" size="sm">
                ⭐ Featured Destination
              </Badge>
            )}
            {categories.map((c) => (
              <Badge key={c.id} variant="gold" size="sm">
                {c.name}
              </Badge>
            ))}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black text-white tracking-tight mb-2">
            {place.name}
          </h1>

          {place.shortDescription && (
            <p className="text-stone-200 text-base sm:text-lg max-w-3xl font-light">
              {place.shortDescription}
            </p>
          )}
        </Container>
      </div>

      <Container className="py-8">
        <Breadcrumbs
          items={[
            { label: 'Places', href: '/places' },
            { label: place.name },
          ]}
        />

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 py-8 border-b border-stone-200">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 mb-4">
                Overview & Architecture
              </h2>
              <div className="text-stone-700 text-base sm:text-lg leading-relaxed font-light space-y-4">
                <p>{place.description || place.shortDescription}</p>
              </div>
            </div>

            {/* Historical Information */}
            {place.historicalInformation && (
              <div className="p-6 sm:p-8 rounded-2xl bg-amber-50/60 border border-amber-200/60">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="text-2xl">📜</span>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
                    Historical Background
                  </h3>
                </div>
                <p className="text-stone-700 text-base leading-relaxed font-light">
                  {place.historicalInformation}
                </p>
              </div>
            )}

            {/* Interactive Features & Detailed Sections */}
            <PlaceFeaturesSection features={features} placeName={place.name} />

            {/* Image Gallery */}
            {place.galleries && place.galleries.length > 0 && (
              <div className="pt-4">
                <ImageGallery images={place.galleries} title={`${place.name} Gallery`} />
              </div>
            )}
          </div>

          {/* Sidebar / Quick Info Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 bg-white space-y-5">
              <h3 className="font-serif font-bold text-xl text-stone-900 pb-3 border-b border-stone-100">
                Visitor Information
              </h3>

              <div className="space-y-4 text-sm">
                {/* Open Days */}
                {place.openDays && (
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-stone-400 block mb-1">
                      Open Days
                    </span>
                    <p className="font-medium text-stone-900">
                      📅 {place.openDays}
                    </p>
                  </div>
                )}

                {/* Timings */}
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-stone-400 block mb-1">
                    Visiting Hours
                  </span>
                  <p className="font-medium text-stone-900">
                    {place.openingTime && place.closingTime
                      ? `🕒 ${place.openingTime} to ${place.closingTime}`
                      : 'Open Daily (Standard sunrise to sunset)'}
                  </p>
                </div>

                {/* Tickets */}
                {place.ticketInformation && (
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-stone-400 block mb-1">
                      Ticket & Entry Fee
                    </span>
                    <p className="font-medium text-stone-900">
                      {place.ticketInformation}
                    </p>
                  </div>
                )}

                {/* Address */}
                {place.address && (
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-stone-400 block mb-1">
                      Address
                    </span>
                    <p className="text-stone-700">
                      {place.address}
                    </p>
                  </div>
                )}

                {/* Contact */}
                {place.contactInformation && (
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-stone-400 block mb-1">
                      Contact
                    </span>
                    <p className="text-stone-700">
                      {place.contactInformation}
                    </p>
                  </div>
                )}

                {/* Website */}
                {place.website && (
                  <div className="pt-2">
                    <a
                      href={place.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline"
                    >
                      <span>Official Website</span>
                      <span>↗</span>
                    </a>
                  </div>
                )}
              </div>
            </Card>

            {/* Related Circuits Card */}
            {circuits.length > 0 && (
              <Card className="p-6 bg-white space-y-3">
                <h4 className="font-serif font-bold text-base text-stone-900">
                  Included in Circuits
                </h4>
                <div className="space-y-2">
                  {circuits.map((circ) => (
                    <Link
                      key={circ.id}
                      href={`/circuits/${circ.slug}`}
                      className="block p-3 rounded-lg bg-stone-50 hover:bg-amber-50/70 border border-stone-200/80 transition-colors group"
                    >
                      <p className="font-medium text-xs text-stone-900 group-hover:text-primary-600">
                        {circ.name}
                      </p>
                      {circ.duration && (
                        <span className="text-[11px] text-stone-500">Duration: {circ.duration}</span>
                      )}
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Map Integration */}
        <div className="py-12 border-b border-stone-200">
          <SectionHeading
            eyebrow="Location & Coordinates"
            title="Finding Your Way"
            align="left"
          />
          <MapComponent
            title={place.name}
            address={place.address}
            latitude={place.latitude}
            longitude={place.longitude}
          />
        </div>

        {/* Nearby Attractions */}
        {nearbyPlaces.length > 0 && (
          <div className="py-12">
            <SectionHeading
              eyebrow="Nearby Attractions"
              title={`Other Places in ${place.locality || 'Delhi'}`}
              align="left"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {nearbyPlaces.map((np) => (
                <PlaceCard key={np.id} place={np} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
