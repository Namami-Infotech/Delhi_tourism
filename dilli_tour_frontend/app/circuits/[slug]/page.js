import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Container from '../../../components/layout/Container';
import Breadcrumbs from '../../../components/navigation/Breadcrumbs';
import PlaceCard from '../../../components/places/PlaceCard';
import MapComponent from '../../../components/maps/MapComponent';
import ImageGallery from '../../../components/gallery/ImageGallery';
import SectionHeading from '../../../components/ui/SectionHeading';
import Badge from '../../../components/ui/Badge';
import Card from '../../../components/ui/Card';
import { getCircuitCover } from '../../../lib/placeImages';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function generateMetadata({ params }) {
  try {
    const res = await fetch(`${API_BASE_URL}/circuits/${params.slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return { title: 'Circuit | Delhi Tourism' };
    const json = await res.json();
    const circuit = json?.data;
    const title = `${circuit?.name || 'Circuit'} | Delhi Tourism`;
    const description = circuit?.shortDescription || circuit?.tagline || `Explore ${circuit?.name} in Delhi.`;
    const image = circuit?.coverImage;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        ...(image ? { images: [{ url: image, alt: circuit?.name }] } : {}),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        ...(image ? { images: [image] } : {}),
      },
    };
  } catch {
    return { title: 'Circuit | Delhi Tourism' };
  }
}

async function getCircuit(slug) {
  try {
    const res = await fetch(`${API_BASE_URL}/circuits/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

async function getAllCircuits() {
  try {
    const res = await fetch(`${API_BASE_URL}/circuits`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch {
    return [];
  }
}

export default async function CircuitDetailPage({ params }) {
  const [circuit, allCircuits] = await Promise.all([
    getCircuit(params.slug),
    getAllCircuits(),
  ]);

  if (!circuit) {
    notFound();
  }

  const places = circuit.places?.map((p) => p.place).filter(Boolean) || [];
  const relatedCircuits = allCircuits.filter((c) => c.slug !== circuit.slug).slice(0, 2);
  const coverImage = getCircuitCover(circuit);

  // Markers for MapComponent
  const mapMarkers = places
    .filter((p) => p.latitude && p.longitude)
    .map((p) => ({
      lat: parseFloat(p.latitude),
      lng: parseFloat(p.longitude),
      title: p.name,
      address: p.address,
    }));

  return (
    <div className="bg-[#faf8f5] min-h-screen">
      {/* Circuit Hero Banner */}
      <div className="relative h-[50vh] sm:h-[58vh] min-h-[400px] w-full bg-stone-950 overflow-hidden flex items-end">
        <Image
          src={coverImage}
          alt={circuit.name}
          fill
          priority
          className="object-cover opacity-60"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />

        <Container className="relative z-10 pb-10 sm:pb-14">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {circuit.category?.name && (
              <Badge variant="gold" size="sm">
                {circuit.category.name}
              </Badge>
            )}
            <Badge variant="default" size="sm" className="bg-white/20 text-white backdrop-blur-md">
              ⏱️ {circuit.duration || 'Full Day'}
            </Badge>
            {circuit.bestTime && (
              <Badge variant="default" size="sm" className="bg-white/20 text-white backdrop-blur-md">
                🌤️ Best: {circuit.bestTime}
              </Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black text-white tracking-tight mb-2">
            {circuit.name}
          </h1>

          {circuit.tagline && (
            <p className="text-amber-300 font-serif italic text-lg sm:text-xl font-light max-w-3xl">
              &ldquo;{circuit.tagline}&rdquo;
            </p>
          )}
        </Container>
      </div>

      <Container className="py-8">
        <Breadcrumbs
          items={[
            { label: 'Circuits', href: '/circuits' },
            { label: circuit.name },
          ]}
        />

        {/* Narrative & Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 py-8 border-b border-stone-200">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-serif font-bold text-3xl text-stone-900">
              Circuit Overview & Story
            </h2>
            <p className="text-stone-700 text-base sm:text-lg leading-relaxed font-light">
              {circuit.description || circuit.shortDescription}
            </p>
          </div>

          {/* Quick Facts Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white space-y-4">
              <h3 className="font-serif font-bold text-lg text-stone-900 pb-3 border-b border-stone-100">
                Circuit Details
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-xs uppercase tracking-wider text-stone-400 font-bold block">Estimated Duration</span>
                  <span className="font-medium text-stone-800">{circuit.duration || 'Full Day (6–8 hours)'}</span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-stone-400 font-bold block">Best Time of Day / Year</span>
                  <span className="font-medium text-stone-800">{circuit.bestTime || 'Morning to Evening / Oct–March'}</span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-stone-400 font-bold block">Total Stops</span>
                  <span className="font-medium text-stone-800">{places.length} Heritage Destinations</span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-stone-400 font-bold block">Category</span>
                  <span className="font-medium text-stone-800">{circuit.category?.name || 'Curated Circuit'}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Sequential Places Route */}
        {places.length > 0 && (
          <div className="py-12 border-b border-stone-200">
            <SectionHeading
              eyebrow="Sequential Route"
              title="Destinations Included in this Circuit"
              description="Explore each landmark in the recommended order for seamless travel and historical context."
              align="left"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {places.map((place, idx) => (
                <div key={place.id} className="relative">
                  <div className="absolute -top-3 -left-2 z-20 w-7 h-7 rounded-full bg-primary-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
                    {idx + 1}
                  </div>
                  <PlaceCard place={place} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map Integration */}
        <div className="py-12 border-b border-stone-200">
          <SectionHeading
            eyebrow="Geographic Trail"
            title="Interactive Circuit Map"
            description="Trace the route and visualize stop markers across Delhi."
            align="left"
          />
          <MapComponent
            title={circuit.name}
            markers={mapMarkers}
            latitude={mapMarkers[0]?.lat}
            longitude={mapMarkers[0]?.lng}
          />
        </div>

        {/* Gallery */}
        {circuit.galleries && circuit.galleries.length > 0 && (
          <div className="py-12 border-b border-stone-200">
            <ImageGallery images={circuit.galleries} title={`${circuit.name} Gallery`} />
          </div>
        )}

        {/* Related Circuits */}
        {relatedCircuits.length > 0 && (
          <div className="py-12">
            <SectionHeading
              eyebrow="Keep Exploring"
              title="Other Popular Circuits"
              align="left"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedCircuits.map((c) => (
                <Link
                  key={c.id}
                  href={`/circuits/${c.slug}`}
                  className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-amber-300 hover:shadow-md transition-all group"
                >
                  <span className="text-xs uppercase font-bold text-primary-600 tracking-wider">
                    ⏱️ {c.duration || 'Full Day'}
                  </span>
                  <h4 className="font-serif font-bold text-2xl text-stone-900 group-hover:text-primary-600 transition-colors mt-1 mb-2">
                    {c.name}
                  </h4>
                  <p className="text-stone-600 text-sm line-clamp-2">
                    {c.shortDescription}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
