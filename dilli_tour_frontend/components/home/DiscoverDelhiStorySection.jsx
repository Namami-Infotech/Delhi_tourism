import React from 'react';
import Container from '../layout/Container';
import SectionHeading from '../ui/SectionHeading';
import Button from '../ui/Button';

export default function DiscoverDelhiStorySection() {
  const epochs = [
    {
      era: 'Ancient Origins',
      name: 'Indraprastha & Lal Kot',
      description: 'Dating back to the Mahabharata era, the earliest fortified city of Delhi was Lal Kot, established in the 8th century by the Tomara rulers.',
      icon: '🏺',
    },
    {
      era: 'Medieval Grandeur',
      name: 'The Delhi Sultanate',
      description: 'Five successive dynasties shaped Delhi between 1206 and 1526, erecting the towering Qutb Minar, Hauz Khas reservoir, and Tughlaqabad fortresses.',
      icon: '⚔️',
    },
    {
      era: 'The Golden Age',
      name: 'Mughal Shahjahanabad',
      description: 'In 1639, Emperor Shah Jahan founded Shahjahanabad — today’s Old Delhi — featuring the imposing Red Fort and Asia’s grandest Friday mosque, Jama Masjid.',
      icon: '🕌',
    },
    {
      era: 'Imperial Architecture',
      name: 'Lutyens’ New Delhi',
      description: 'Planned by Sir Edwin Lutyens and Herbert Baker in 1911, featuring monumental tree-lined boulevards, India Gate, and the imposing sandstone Secretariat.',
      icon: '🏛️',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#faf8f5] relative overflow-hidden">
      <Container>
        <SectionHeading
          eyebrow="The Layers of History"
          title="A City Built Upon Seven Ancient Capitals"
          description="Few cities in the world possess the historical depth of Delhi. Every corner carries whispers of dynasties, empires, poets, and freedom fighters."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16">
          {epochs.map((epoch, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-2xl mb-4">
                  {epoch.icon}
                </div>
                <span className="text-xs uppercase font-bold tracking-wider text-primary-600 block mb-1">
                  {epoch.era}
                </span>
                <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
                  {epoch.name}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {epoch.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center text-xs font-semibold text-stone-400">
                <span>Era 0{idx + 1} of 04</span>
              </div>
            </div>
          ))}
        </div>

        {/* Call-to-action Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white p-8 sm:p-12 lg:p-16 text-center shadow-xl border border-stone-800">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-widest inline-block border border-amber-500/30">
              Start Your Delhi Journey Today
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-white">
              Ready to Discover Delhi&apos;s Secrets?
            </h2>
            <p className="text-stone-300 text-base sm:text-lg leading-relaxed font-light">
              Explore curated routes, find monument timings and ticket prices, or take a deep dive into centuries of vibrant living heritage.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button href="/circuits" variant="primary" size="lg">
                Browse Thematic Circuits
              </Button>
              <Button href="/places" variant="secondary" size="lg" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                Explore All Destinations
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
