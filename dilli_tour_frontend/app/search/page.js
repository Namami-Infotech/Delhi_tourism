import React from 'react';
import Link from 'next/link';
import Container from '../../components/layout/Container';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import SectionHeading from '../../components/ui/SectionHeading';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import PlaceCard from '../../components/places/PlaceCard';
import CircuitCard from '../../components/circuits/CircuitCard';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const metadata = {
  title: 'Search Delhi Tourism | Discover Places, Circuits & Stories',
  description: 'Search destinations, curated circuits, cultural categories, and itineraries across Delhi.',
};

async function getSearchResults(query) {
  if (!query || query.trim().length < 2) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query.trim())}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

export default async function SearchPage({ searchParams }) {
  const query = searchParams?.q || '';
  const results = await getSearchResults(query);

  const places = results?.places || [];
  const circuits = results?.circuits || [];
  const categories = results?.categories || [];
  const events = results?.events || [];
  const itineraries = results?.itineraries || [];

  const totalResults = places.length + circuits.length + categories.length + events.length + itineraries.length;

  return (
    <div className="py-10 bg-[#faf8f5] min-h-screen">
      <Container>
        <Breadcrumbs items={[{ label: 'Search' }]} />

        {/* Search Header and Input */}
        <div className="py-8 border-b border-stone-200">
          <SectionHeading
            eyebrow="Global Discovery"
            title={query ? `Search Results for "${query}"` : 'Search Delhi Tourism'}
            description="Find places, circuits, categories, upcoming events, and itineraries across the capital."
            align="left"
          />

          <form action="/search" method="GET" className="max-w-2xl mt-4">
            <div className="relative flex items-center shadow-sm rounded-xl overflow-hidden border border-stone-300 bg-white">
              <span className="pl-4 text-stone-400">
                🔍
              </span>
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search monuments, circuits, foods, spiritual paths..."
                className="w-full px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {query && (
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mt-4">
              Found {totalResults} matching results across categories
            </p>
          )}
        </div>

        {/* Results Container */}
        {query ? (
          totalResults > 0 ? (
            <div className="py-12 space-y-16">
              {/* Places */}
              {places.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif font-bold text-2xl text-stone-900">
                      Tourist Destinations ({places.length})
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {places.map((place) => (
                      <PlaceCard key={place.id} place={place} />
                    ))}
                  </div>
                </div>
              )}

              {/* Circuits */}
              {circuits.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif font-bold text-2xl text-stone-900">
                      Curated Circuits ({circuits.length})
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {circuits.map((circuit) => (
                      <CircuitCard key={circuit.id} circuit={circuit} />
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              {categories.length > 0 && (
                <div>
                  <h2 className="font-serif font-bold text-2xl text-stone-900 mb-6">
                    Thematic Categories ({categories.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/categories/${cat.slug}`}
                        className="p-5 rounded-xl bg-white border border-stone-200 hover:border-amber-300 hover:shadow-md transition-all"
                      >
                        <h4 className="font-serif font-bold text-base text-stone-900">
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

              {/* Itineraries & Events */}
              {((itineraries.length > 0) || (events.length > 0)) && (
                <div>
                  <h2 className="font-serif font-bold text-2xl text-stone-900 mb-6">
                    Itineraries & Events
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {itineraries.map((it) => (
                      <Card key={it.id} className="p-6">
                        <Badge variant="gold" size="sm" className="mb-2">Itinerary • {it.duration}</Badge>
                        <h3 className="font-serif font-bold text-xl text-stone-900 mb-1">{it.title}</h3>
                        <p className="text-stone-600 text-xs line-clamp-2 mb-3">{it.description}</p>
                        <Link href={`/itineraries/${it.slug}`} className="text-xs font-semibold text-primary-600">
                          View Itinerary →
                        </Link>
                      </Card>
                    ))}
                    {events.map((ev) => (
                      <Card key={ev.id} className="p-6">
                        <Badge variant="accent" size="sm" className="mb-2">Event • {ev.venue}</Badge>
                        <h3 className="font-serif font-bold text-xl text-stone-900 mb-1">{ev.title}</h3>
                        <p className="text-stone-600 text-xs line-clamp-2 mb-3">{ev.description}</p>
                        <Link href={`/events/${ev.slug}`} className="text-xs font-semibold text-primary-600">
                          Event Details →
                        </Link>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-20 text-center bg-white rounded-2xl border border-stone-200 p-8 my-8">
              <span className="text-5xl mb-3 block">🔍</span>
              <h3 className="font-serif font-bold text-2xl text-stone-900 mb-2">
                No matching results found for &ldquo;{query}&rdquo;
              </h3>
              <p className="text-stone-500 text-sm max-w-md mx-auto mb-6">
                Try searching for broader keywords like &quot;Fort&quot;, &quot;Heritage&quot;, &quot;Spiritual&quot;, &quot;Mosque&quot;, or &quot;Market&quot;.
              </p>
            </div>
          )
        ) : (
          <div className="py-16 text-center text-stone-500 text-sm">
            Enter a search term above to explore Delhi&apos;s monuments, circuits, categories, and events.
          </div>
        )}
      </Container>
    </div>
  );
}
