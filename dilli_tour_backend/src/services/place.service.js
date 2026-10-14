const prisma = require('../config/database');
const slugify = require('slugify');

const getAll = async (query = {}) => {
  const where = { isActive: true };

  if (query.featured === 'true') {
    where.isFeatured = true;
  }
  if (query.locality) {
    where.locality = { contains: query.locality };
  }
  if (query.categoryId) {
    where.categories = {
      some: { categoryId: parseInt(query.categoryId) },
    };
  }
  if (query.categorySlug) {
    where.categories = {
      some: { category: { slug: query.categorySlug } },
    };
  }
  if (query.circuitId) {
    where.circuits = {
      some: { circuitId: parseInt(query.circuitId) },
    };
  }
  if (query.feature) {
    where.features = {
      some: { feature: query.feature },
    };
  }

  return prisma.place.findMany({
    where,
    include: {
      categories: { include: { category: true } },
      circuits: { include: { circuit: true } },
      galleries: { orderBy: { displayOrder: 'asc' } },
      features: true,
    },
    orderBy: { name: 'asc' },
  });
};

const getBySlug = async (slug) => {
  const place = await prisma.place.findUnique({
    where: { slug },
    include: {
      categories: { include: { category: true } },
      circuits: {
        include: { circuit: true },
        orderBy: { sequence: 'asc' },
      },
      galleries: { orderBy: { displayOrder: 'asc' } },
      features: true,
      itineraryStops: {
        include: { itinerary: true },
      },
    },
  });
  if (!place) {
    const err = new Error('Place not found.');
    err.statusCode = 404;
    throw err;
  }
  return place;
};

const create = async (data) => {
  const { categoryIds, circuitIds, features, ...rest } = data;
  const slug = slugify(rest.name, { lower: true, strict: true });

  return prisma.place.create({
    data: {
      ...rest,
      slug,
      categories: categoryIds && categoryIds.length > 0
        ? { create: categoryIds.map((id) => ({ categoryId: parseInt(id) })) }
        : undefined,
      circuits: circuitIds && circuitIds.length > 0
        ? { create: circuitIds.map((id) => ({ circuitId: parseInt(id) })) }
        : undefined,
      features: features && features.length > 0
        ? { create: features.map((f) => ({ feature: f })) }
        : undefined,
    },
    include: {
      categories: { include: { category: true } },
      circuits: { include: { circuit: true } },
      features: true,
    },
  });
};

const update = async (id, data) => {
  const placeId = parseInt(id);
  const existing = await prisma.place.findUnique({ where: { id: placeId } });
  if (!existing) {
    const err = new Error('Place not found.');
    err.statusCode = 404;
    throw err;
  }

  const { categoryIds, circuitIds, features, ...rest } = data;
  if (rest.name && rest.name !== existing.name) {
    rest.slug = slugify(rest.name, { lower: true, strict: true });
  }

  // Update relations if explicitly provided
  if (categoryIds) {
    await prisma.placeCategory.deleteMany({ where: { placeId } });
    if (categoryIds.length > 0) {
      await prisma.placeCategory.createMany({
        data: categoryIds.map((catId) => ({ placeId, categoryId: parseInt(catId) })),
      });
    }
  }

  if (circuitIds) {
    await prisma.circuitPlace.deleteMany({ where: { placeId } });
    if (circuitIds.length > 0) {
      await prisma.circuitPlace.createMany({
        data: circuitIds.map((cId) => ({ placeId, circuitId: parseInt(cId) })),
      });
    }
  }

  if (features) {
    await prisma.placeFeature.deleteMany({ where: { placeId } });
    if (features.length > 0) {
      await prisma.placeFeature.createMany({
        data: features.map((f) => ({ placeId, feature: f })),
      });
    }
  }

  return prisma.place.update({
    where: { id: placeId },
    data: rest,
    include: {
      categories: { include: { category: true } },
      circuits: { include: { circuit: true } },
      features: true,
    },
  });
};

const remove = async (id) => {
  const placeId = parseInt(id);
  const existing = await prisma.place.findUnique({ where: { id: placeId } });
  if (!existing) {
    const err = new Error('Place not found.');
    err.statusCode = 404;
    throw err;
  }
  return prisma.place.update({
    where: { id: placeId },
    data: { isActive: false },
  });
};

const { getNearbyPlaces } = require('./home.service');

module.exports = { getAll, getBySlug, getNearbyPlaces, create, update, remove };
