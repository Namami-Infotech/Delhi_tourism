/**
 * Curated high-resolution photography for Delhi Tourism Platform.
 * Provides fallback photography for monuments, categories, and circuits.
 */

export const PLACE_IMAGES = {
  'red-fort': 'https://images.unsplash.com/photo-1592635196078-9fdc757f27f4?auto=format&fit=crop&w=1200&q=80',
  'jama-masjid': 'https://images.unsplash.com/photo-1598890777032-bde13fbe3497?auto=format&fit=crop&w=1200&q=80',
  'humayuns-tomb': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
  'qutb-minar': 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=1200&q=80',
  'india-gate': 'https://images.unsplash.com/photo-1585130401366-fe05a8d813c4?auto=format&fit=crop&w=1200&q=80',
  'bangla-sahib-gurudwara': 'https://images.unsplash.com/photo-1626244520779-79f90f230bcf?auto=format&fit=crop&w=1200&q=80',
  'chandni-chowk': 'https://images.unsplash.com/photo-1588099768523-f4e6a5679d88?auto=format&fit=crop&w=1200&q=80',
  'lotus-temple': 'https://images.unsplash.com/photo-1608958435020-e8a7109ba809?auto=format&fit=crop&w=1200&q=80',
};

export const CATEGORY_IMAGES = {
  'spiritual-circuits': 'https://images.unsplash.com/photo-1608958435020-e8a7109ba809?auto=format&fit=crop&w=800&q=80',
  'heritage-circuits': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
  'cultural-experiences': 'https://images.unsplash.com/photo-1588099768523-f4e6a5679d88?auto=format&fit=crop&w=800&q=80',
  'museums-galleries': 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=800&q=80',
  'food-culinary': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
  'markets-shopping': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
  'parks-gardens': 'https://images.unsplash.com/photo-1585130401366-fe05a8d813c4?auto=format&fit=crop&w=800&q=80',
  'arts-entertainment': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
  'monuments': 'https://images.unsplash.com/photo-1592635196078-9fdc757f27f4?auto=format&fit=crop&w=800&q=80',
  'festivals-events': 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80',
  'family-kids': 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80',
  'day-trips': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
};

export const CIRCUIT_IMAGES = {
  'delhis-sacred-harmony': 'https://images.unsplash.com/photo-1626244520779-79f90f230bcf?auto=format&fit=crop&w=1200&q=80',
  'echoes-of-delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
  'the-heritage-of-delhi': 'https://images.unsplash.com/photo-1592635196078-9fdc757f27f4?auto=format&fit=crop&w=1200&q=80',
  'the-soul-of-delhi': 'https://images.unsplash.com/photo-1588099768523-f4e6a5679d88?auto=format&fit=crop&w=1200&q=80',
};

export const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=2000&q=85';

export function getPlaceCover(place) {
  if (place?.coverImage) return place.coverImage;
  if (place?.slug && PLACE_IMAGES[place.slug]) return PLACE_IMAGES[place.slug];
  return 'https://images.unsplash.com/photo-1592635196078-9fdc757f27f4?auto=format&fit=crop&w=1200&q=80';
}

export function getCategoryCover(category) {
  if (category?.image) return category.image;
  if (category?.slug && CATEGORY_IMAGES[category.slug]) return CATEGORY_IMAGES[category.slug];
  return 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80';
}

export function getCircuitCover(circuit) {
  if (circuit?.coverImage) return circuit.coverImage;
  if (circuit?.slug && CIRCUIT_IMAGES[circuit.slug]) return CIRCUIT_IMAGES[circuit.slug];
  return 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80';
}
