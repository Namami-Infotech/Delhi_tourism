import React from 'react';
import Container from '../layout/Container';
import SectionHeading from '../ui/SectionHeading';
import CircuitCard from './CircuitCard';
import Button from '../ui/Button';

export default function FeaturedCircuitsSection({ circuits = [] }) {
  if (!circuits || circuits.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 bg-white border-t border-b border-stone-100">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <SectionHeading
            eyebrow="Curated Circuits"
            title="Thematic Journeys Through Delhi"
            description="Specially designed routes connecting iconic landmarks, spiritual shrines, and historical narratives for an unforgettable day."
            align="left"
            className="mb-0"
          />
          <div className="mt-6 sm:mt-0 shrink-0">
            <Button href="/circuits" variant="outline" size="sm">
              Explore All Circuits →
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {circuits.map((circuit) => (
            <CircuitCard key={circuit.id} circuit={circuit} />
          ))}
        </div>
      </Container>
    </section>
  );
}
