import React from 'react';
import Container from '../../components/layout/Container';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import CircuitCard from '../../components/circuits/CircuitCard';
import SectionHeading from '../../components/ui/SectionHeading';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const metadata = {
  title: 'Tourism Circuits | Delhi Tourism',
  description: 'Explore curated tourism circuits of Delhi: Delhi Sacred Harmony, Echoes of Delhi, The Heritage of Delhi, and The Soul of Delhi.',
};

async function getCircuits() {
  try {
    const res = await fetch(`${API_BASE_URL}/circuits`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch {
    return [];
  }
}

export default async function CircuitsPage() {
  const circuits = await getCircuits();

  return (
    <div className="py-10 bg-[#faf8f5] min-h-screen">
      <Container>
        <Breadcrumbs items={[{ label: 'Circuits' }]} />

        <div className="py-8">
          <SectionHeading
            eyebrow="Curated Routes"
            title="Delhi Tourism Circuits"
            description="Experience seamless journeys through Delhi's cultural, spiritual, and historical landscapes. Each circuit links complementary destinations with optimal travel routes and rich thematic storytelling."
            align="left"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {circuits.map((circuit) => (
              <CircuitCard key={circuit.id} circuit={circuit} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
