import Hero from '../components/hero/Hero';
import CategorySection from '../components/categories/CategorySection';
import FeaturedCircuitsSection from '../components/circuits/FeaturedCircuitsSection';
import FeaturedPlacesSection from '../components/places/FeaturedPlacesSection';
import ExperiencesSection from '../components/experiences/ExperiencesSection';
import SuggestedItinerariesSection from '../components/itineraries/SuggestedItinerariesSection';
import UpcomingEventsSection from '../components/events/UpcomingEventsSection';
import DiscoverDelhiStorySection from '../components/home/DiscoverDelhiStorySection';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

async function fetchApi(endpoint) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  // Parallel fetch of homepage content entities
  const [categories, circuits, places, itineraries, events] = await Promise.all([
    fetchApi('/categories'),
    fetchApi('/circuits?featured=true'),
    fetchApi('/places?featured=true'),
    fetchApi('/itineraries?featured=true'),
    fetchApi('/events?featured=true'),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Banner & Quick Search */}
      <Hero />

      {/* 2. Explore Categories */}
      <CategorySection categories={categories || []} />

      {/* 3. Featured Circuits */}
      <FeaturedCircuitsSection circuits={circuits || []} />

      {/* 4. Featured Destinations */}
      <FeaturedPlacesSection places={places || []} />

      {/* 5. Delhi Living Experiences */}
      <ExperiencesSection />

      {/* 6. Suggested Itineraries */}
      <SuggestedItinerariesSection itineraries={itineraries || []} />

      {/* 7. Upcoming Festivals & Events */}
      <UpcomingEventsSection events={events || []} />

      {/* 8. Discover Delhi - Seven Ancient Cities Story & CTA */}
      <DiscoverDelhiStorySection />
    </div>
  );
}