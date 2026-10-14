import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Container from '../layout/Container';
import SectionHeading from '../ui/SectionHeading';
import Badge from '../ui/Badge';

export default function ExperiencesSection() {
  const experiences = [
    {
      title: 'Old Delhi Street Food & Spice Trail',
      tagline: 'Centuries-old recipes in the lanes of Shahjahanabad',
      description: 'Savour hot jalebis at Dariba Kalan, layered stuffed paranthas at Paranthe Wali Gali, and inhale the fragrant aromas of Asia’s largest spice market at Khari Baoli.',
      category: 'Culinary Heritage',
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
      href: '/categories/food-culinary',
    },
    {
      title: 'Sufi Evenings & Sacred Devotion',
      tagline: 'Soulful qawwalis in ancient spiritual courtyards',
      description: 'Experience Thursday evening qawwali recitations echoing through the 14th-century Hazrat Nizamuddin Dargah, celebrating love, harmony, and poetic mysticism.',
      category: 'Spiritual Tradition',
      image: 'https://images.unsplash.com/photo-1598890777032-bde13fbe3497?auto=format&fit=crop&w=800&q=80',
      href: '/circuits/delhis-sacred-harmony',
    },
    {
      title: 'Mughal Architecture & Royal Gardens',
      tagline: 'Intricate sandstone arches, marble domes & charbaghs',
      description: 'Witness the architectural precursors to the Taj Mahal at Humayun’s Tomb and trace the grandeur of imperial court life inside the Diwan-i-Khas of the Red Fort.',
      category: 'Architectural Marvels',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
      href: '/circuits/the-heritage-of-delhi',
    },
    {
      title: 'Artisan Crafts & Festive Bazaars',
      tagline: 'Traditional weaves, pottery & folk treasures',
      description: 'Discover handcrafted textiles, brassware, and regional Indian arts directly from rural craftspersons at Dilli Haat and historic government emporiums on Baba Kharak Singh Marg.',
      category: 'Cultural Crafts',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      href: '/categories/markets-shopping',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-stone-900 text-white relative overflow-hidden">
      {/* Decorative background cultural pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#d4821e_1px,transparent_1px)] [background-size:24px_24px]" />

      <Container className="relative z-10">
        <SectionHeading
          eyebrow="Living Culture"
          title="Iconic Delhi Experiences"
          description="Immerse yourself in sensory memories that define the soul of the capital city — from mystic poetry to mouth-watering cuisine."
          light
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {experiences.map((exp, idx) => (
            <Link
              key={idx}
              href={exp.href}
              className="group relative rounded-3xl overflow-hidden bg-stone-800/80 border border-stone-700 hover:border-amber-400/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col sm:flex-row"
            >
              {/* Image side */}
              <div className="relative h-60 sm:h-auto sm:w-2/5 shrink-0 overflow-hidden">
                <Image
                  src={exp.image}
                  alt={exp.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-stone-900/60 to-transparent" />
              </div>

              {/* Text side */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <Badge variant="gold" size="sm" className="mb-3">
                    {exp.category}
                  </Badge>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-white group-hover:text-amber-300 transition-colors mb-2">
                    {exp.title}
                  </h3>
                  <p className="text-amber-400/90 text-xs font-serif italic mb-3">
                    {exp.tagline}
                  </p>
                  <p className="text-stone-300 text-sm leading-relaxed line-clamp-3">
                    {exp.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-700/60 flex items-center justify-between text-xs font-semibold text-amber-400 group-hover:text-amber-300">
                  <span>Explore Experience</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
