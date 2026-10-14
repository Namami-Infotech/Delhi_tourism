const prisma = require('../config/database');

/**
 * Global search across places, circuits, categories, events, and itineraries.
 */
const search = async (q) => {
  const [places, circuits, categories, events, itineraries] = await Promise.all([
    prisma.place.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q } },
          { shortDescription: { contains: q } },
          { locality: { contains: q } },
        ],
      },
      select: { id: true, name: true, slug: true, shortDescription: true, coverImage: true, locality: true },
      take: 5,
    }),
    prisma.circuit.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q } },
          { shortDescription: { contains: q } },
          { tagline: { contains: q } },
        ],
      },
      select: { id: true, name: true, slug: true, shortDescription: true, coverImage: true, tagline: true },
      take: 5,
    }),
    prisma.category.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q } },
          { shortDescription: { contains: q } },
        ],
      },
      select: { id: true, name: true, slug: true, shortDescription: true, image: true },
      take: 5,
    }),
    prisma.event.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
          { venue: { contains: q } },
        ],
      },
      select: { id: true, title: true, slug: true, startDate: true, venue: true, coverImage: true },
      take: 5,
    }),
    prisma.itinerary.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
        ],
      },
      select: { id: true, title: true, slug: true, description: true, coverImage: true, duration: true },
      take: 5,
    }),
  ]);

  return { places, circuits, categories, events, itineraries };
};

module.exports = { search };
