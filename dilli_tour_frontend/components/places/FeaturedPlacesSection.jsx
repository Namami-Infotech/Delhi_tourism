import React from 'react';
import Container from '../layout/Container';
import SectionHeading from '../ui/SectionHeading';
import PlaceCard from './PlaceCard';
import Button from '../ui/Button';

export default function FeaturedPlacesSection({ places = [] }) {
  if (!places || places.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 bg-[#faf8f5]">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <SectionHeading
            eyebrow="Iconic Landmarks"
            title="Must-Visit Destinations in Delhi"
            description="Explore the world-famous UNESCO World Heritage sites, majestic mosques, sacred gurudwaras, and bustling bazaars."
            align="left"
            className="mb-0"
          />
          <div className="mt-6 sm:mt-0 shrink-0">
            <Button href="/places" variant="outline" size="sm">
              View All Destinations →
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </Container>
    </section>
  );
}
