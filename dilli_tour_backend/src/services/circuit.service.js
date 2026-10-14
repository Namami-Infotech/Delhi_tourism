const prisma = require('../config/database');
const slugify = require('slugify');

const getAll = async (query = {}) => {
  const where = { isActive: true };
  if (query.featured === 'true') {
    where.isFeatured = true;
  }
  if (query.categoryId) {
    where.categoryId = parseInt(query.categoryId);
  }
  return prisma.circuit.findMany({
    where,
    include: {
      category: true,
      places: {
        include: { place: true },
        orderBy: { sequence: 'asc' },
      },
    },
    orderBy: { displayOrder: 'asc' },
  });
};

const getBySlug = async (slug) => {
  const circuit = await prisma.circuit.findUnique({
    where: { slug },
    include: {
      category: true,
      places: {
        include: { place: true },
        orderBy: { sequence: 'asc' },
      },
      galleries: { orderBy: { displayOrder: 'asc' } },
    },
  });
  if (!circuit) {
    const err = new Error('Circuit not found.');
    err.statusCode = 404;
    throw err;
  }
  return circuit;
};

const create = async (data) => {
  const { places, ...rest } = data;
  const slug = slugify(rest.name, { lower: true, strict: true });

  const circuitPlacesData = places
    ? places.map((p, idx) => ({
        placeId: typeof p === 'object' ? parseInt(p.placeId) : parseInt(p),
        sequence: typeof p === 'object' && p.sequence !== undefined ? parseInt(p.sequence) : idx + 1,
      }))
    : undefined;

  return prisma.circuit.create({
    data: {
      ...rest,
      slug,
      places: circuitPlacesData ? { create: circuitPlacesData } : undefined,
    },
    include: {
      category: true,
      places: { include: { place: true } },
    },
  });
};

const update = async (id, data) => {
  const circuitId = parseInt(id);
  const existing = await prisma.circuit.findUnique({ where: { id: circuitId } });
  if (!existing) {
    const err = new Error('Circuit not found.');
    err.statusCode = 404;
    throw err;
  }

  const { places, ...rest } = data;
  if (rest.name && rest.name !== existing.name) {
    rest.slug = slugify(rest.name, { lower: true, strict: true });
  }

  if (places) {
    await prisma.circuitPlace.deleteMany({ where: { circuitId } });
    if (places.length > 0) {
      await prisma.circuitPlace.createMany({
        data: places.map((p, idx) => ({
          circuitId,
          placeId: typeof p === 'object' ? parseInt(p.placeId) : parseInt(p),
          sequence: typeof p === 'object' && p.sequence !== undefined ? parseInt(p.sequence) : idx + 1,
        })),
      });
    }
  }

  return prisma.circuit.update({
    where: { id: circuitId },
    data: rest,
    include: {
      category: true,
      places: { include: { place: true } },
    },
  });
};

const remove = async (id) => {
  const circuitId = parseInt(id);
  const existing = await prisma.circuit.findUnique({ where: { id: circuitId } });
  if (!existing) {
    const err = new Error('Circuit not found.');
    err.statusCode = 404;
    throw err;
  }
  return prisma.circuit.update({
    where: { id: circuitId },
    data: { isActive: false },
  });
};

module.exports = { getAll, getBySlug, create, update, remove };
