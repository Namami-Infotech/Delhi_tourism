const prisma = require('../config/database');
const slugify = require('slugify');

const getAll = async (query = {}) => {
  const where = {};
  if (query.all !== 'true') {
    where.isActive = true;
  }
  if (query.featured === 'true') {
    where.isFeatured = true;
  }
  return prisma.itinerary.findMany({
    where,
    include: {
      stops: {
        include: { place: true },
        orderBy: [{ day: 'asc' }, { sequence: 'asc' }],
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

const getBySlug = async (slug) => {
  const itinerary = await prisma.itinerary.findUnique({
    where: { slug },
    include: {
      stops: {
        include: { place: true },
        orderBy: [{ day: 'asc' }, { sequence: 'asc' }],
      },
      galleries: { orderBy: { displayOrder: 'asc' } },
    },
  });
  if (!itinerary) {
    const err = new Error('Itinerary not found.');
    err.statusCode = 404;
    throw err;
  }
  return itinerary;
};

const create = async (data) => {
  const { stops, ...rest } = data;
  const slug = slugify(rest.title, { lower: true, strict: true });
  return prisma.itinerary.create({
    data: {
      ...rest,
      slug,
      stops: stops && stops.length > 0
        ? {
            create: stops.map((s, idx) => ({
              placeId: parseInt(s.placeId),
              day: s.day ? parseInt(s.day) : 1,
              sequence: s.sequence !== undefined ? parseInt(s.sequence) : idx + 1,
              estimatedDuration: s.estimatedDuration || null,
              notes: s.notes || null,
            })),
          }
        : undefined,
    },
    include: {
      stops: {
        include: { place: true },
        orderBy: [{ day: 'asc' }, { sequence: 'asc' }],
      },
    },
  });
};

const update = async (id, data) => {
  const itineraryId = parseInt(id);
  const existing = await prisma.itinerary.findUnique({ where: { id: itineraryId } });
  if (!existing) {
    const err = new Error('Itinerary not found.');
    err.statusCode = 404;
    throw err;
  }

  const { stops, ...rest } = data;
  if (rest.title && rest.title !== existing.title) {
    rest.slug = slugify(rest.title, { lower: true, strict: true });
  }

  if (stops) {
    await prisma.itineraryStop.deleteMany({ where: { itineraryId } });
    if (stops.length > 0) {
      await prisma.itineraryStop.createMany({
        data: stops.map((s, idx) => ({
          itineraryId,
          placeId: parseInt(s.placeId),
          day: s.day ? parseInt(s.day) : 1,
          sequence: s.sequence !== undefined ? parseInt(s.sequence) : idx + 1,
          estimatedDuration: s.estimatedDuration || null,
          notes: s.notes || null,
        })),
      });
    }
  }

  return prisma.itinerary.update({
    where: { id: itineraryId },
    data: rest,
    include: {
      stops: {
        include: { place: true },
        orderBy: [{ day: 'asc' }, { sequence: 'asc' }],
      },
    },
  });
};

const remove = async (id) => {
  const itineraryId = parseInt(id);
  const existing = await prisma.itinerary.findUnique({ where: { id: itineraryId } });
  if (!existing) {
    const err = new Error('Itinerary not found.');
    err.statusCode = 404;
    throw err;
  }
  return prisma.itinerary.update({
    where: { id: itineraryId },
    data: { isActive: false },
  });
};

module.exports = { getAll, getBySlug, create, update, remove };
