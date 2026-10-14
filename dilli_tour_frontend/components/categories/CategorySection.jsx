import React from 'react';
import Container from '../layout/Container';
import SectionHeading from '../ui/SectionHeading';
import CategoryCard from './CategoryCard';
import Button from '../ui/Button';

export default function CategorySection({ categories = [] }) {
  const displayCategories = categories.length > 0 ? categories : [];

  return (
    <section className="py-20 lg:py-28 bg-[#faf8f5]">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <SectionHeading
            eyebrow="Explore Categories"
            title="Diverse Ways to Experience Delhi"
            description="From centuries-old heritage walks and sacred spiritual corridors to bustling spice bazaars and serene Mughal gardens."
            align="left"
            className="mb-0"
          />
          <div className="mt-6 sm:mt-0 shrink-0">
            <Button href="/categories" variant="outline" size="sm">
              View All 12 Categories →
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {displayCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Container>
    </section>
  );
}
