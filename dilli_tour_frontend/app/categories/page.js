import React from 'react';
import Container from '../../components/layout/Container';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import CategoryCard from '../../components/categories/CategoryCard';
import SectionHeading from '../../components/ui/SectionHeading';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const metadata = {
  title: 'Tourism Categories | Delhi Tourism',
  description: 'Explore Delhi through distinct tourism categories: Spiritual, Heritage, Cultural, Food & Culinary, Markets, Monuments, and more.',
};

async function getCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch {
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="py-10 bg-[#faf8f5] min-h-screen">
      <Container>
        <Breadcrumbs items={[{ label: 'Categories' }]} />

        <div className="py-8">
          <SectionHeading
            eyebrow="Explore Delhi by Theme"
            title="Tourism Categories"
            description="Whether you seek ancient architectural wonders, sacred spiritual sanctuary, fragrant spice lanes, or world-class art collections, discover Delhi through tailored thematic categories."
            align="left"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
