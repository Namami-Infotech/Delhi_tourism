import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Container from '../../../components/layout/Container';
import Breadcrumbs from '../../../components/navigation/Breadcrumbs';
import CircuitCard from '../../../components/circuits/CircuitCard';
import PlaceCard from '../../../components/places/PlaceCard';
import SectionHeading from '../../../components/ui/SectionHeading';
import Badge from '../../../components/ui/Badge';
import { getCategoryCover } from '../../../lib/placeImages';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function generateMetadata({ params }) {
  try {
    const res = await fetch(`${API_BASE_URL}/categories/${params.slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return { title: 'Category | Delhi Tourism' };
    const json = await res.json();
    const cat = json?.data;
    const title = `${cat?.name || 'Category'} | Delhi Tourism`;
    const description = cat?.shortDescription || cat?.description || `Explore ${cat?.name} in Delhi.`;
    const image = cat?.coverImage;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        ...(image ? { images: [{ url: image, alt: cat?.name }] } : {}),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        ...(image ? { images: [image] } : {}),
      },
    };
  } catch {
    return { title: 'Category | Delhi Tourism' };
  }
}

async function getCategory(slug) {
  try {
    const res = await fetch(`${API_BASE_URL}/categories/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

async function getAllCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch {
    return [];
  }
}

export default async function CategoryDetailPage({ params }) {
  const [category, allCategories] = await Promise.all([
    getCategory(params.slug),
    getAllCategories(),
  ]);

  if (!category) {
    notFound();
  }

  const circuits = category.circuits || [];
  const places = category.places?.map((p) => p.place || p).filter(Boolean) || [];
  const relatedCategories = allCategories.filter((c) => c.slug !== category.slug).slice(0, 4);
  const coverImage = getCategoryCover(category);

  return (
    <div className="bg-[#faf8f5] min-h-screen">
      {/* Category Hero Banner */}
      <div className="relative h-[45vh] sm:h-[50vh] min-h-[350px] w-full bg-stone-950 overflow-hidden flex items-end">
        <Image
          src={coverImage}
          alt={category.name}
          fill
          priority
          className="object-cover opacity-60"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />

        <Container className="relative z-10 pb-10 sm:pb-14">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="gold" size="sm">
              {category.icon || '🏛️'} Delhi Tourism Category
            </Badge>
            {category.isFeatured && (
              <Badge variant="featured" size="sm">
                ⭐ Featured
              </Badge>
            )}
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black text-white tracking-tight mb-3">
            {category.name}
          </h1>
          {category.shortDescription && (
            <p className="text-base sm:text-xl text-stone-200 max-w-2xl font-light">
              {category.shortDescription}
            </p>
          )}
        </Container>
      </div>

      <Container className="py-8">
        <Breadcrumbs
          items={[
            { label: 'Categories', href: '/categories' },
            { label: category.name },
          ]}
        />

        {/* Detailed Narrative */}
        {category.description && (
          <div className="py-8 border-b border-stone-200">
            <h2 className="font-serif font-bold text-2xl text-stone-900 mb-3">
              About this Category
            </h2>
            <p className="text-stone-700 text-base sm:text-lg leading-relaxed max-w-4xl font-light">
              {category.description}
            </p>
          </div>
        )}

        {/* Featured Circuits in this Category */}
        {circuits.length > 0 && (
          <div className="py-12 border-b border-stone-200">
            <SectionHeading
              eyebrow="Thematic Routes"
              title={`Circuits in ${category.name}`}
              description="Follow structured tourism circuits specifically curated within this category."
              align="left"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {circuits.map((circuit) => (
                <CircuitCard key={circuit.id} circuit={circuit} />
              ))}
            </div>
          </div>
        )}

        {/* Places in this Category */}
        {places.length > 0 && (
          <div className="py-12 border-b border-stone-200">
            <SectionHeading
              eyebrow="Destinations"
              title={`Places in ${category.name}`}
              description="Historic landmarks, monuments, and cultural points of interest included in this theme."
              align="left"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {places.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </div>
        )}

        {/* Other Categories */}
        {relatedCategories.length > 0 && (
          <div className="py-12">
            <SectionHeading
              eyebrow="Keep Exploring"
              title="Related Tourism Categories"
              align="left"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="p-5 rounded-xl bg-white border border-stone-200/80 hover:border-amber-300 hover:shadow-md transition-all group"
                >
                  <span className="text-2xl mb-2 block">{cat.icon || '🏛️'}</span>
                  <h4 className="font-serif font-bold text-base text-stone-900 group-hover:text-primary-600 transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                    {cat.shortDescription}
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
