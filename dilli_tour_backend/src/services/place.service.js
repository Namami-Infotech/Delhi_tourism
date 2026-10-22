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

const formatPlaceFields = (fields) => {
  const data = { ...fields };
  if (data.entryFeeIndian !== undefined) data.entryFeeIndian = Number(data.entryFeeIndian) || 0;
  if (data.entryFeeForeigner !== undefined) data.entryFeeForeigner = Number(data.entryFeeForeigner) || 0;
  if (data.entryFeeChild !== undefined) data.entryFeeChild = Number(data.entryFeeChild) || 0;
  if (data.isTicketRequired !== undefined) data.isTicketRequired = Boolean(data.isTicketRequired);
  return data;
};

const create = async (data) => {
  const { categoryIds, circuitIds, features, ...rest } = data;
  const slug = slugify(rest.name, { lower: true, strict: true });
  const formattedRest = formatPlaceFields(rest);

  return prisma.place.create({
    data: {
      ...formattedRest,
      slug,
      categories: categoryIds && categoryIds.length > 0
        ? { create: categoryIds.map((id) => ({ categoryId: parseInt(id) })) }
        : undefined,
      circuits: circuitIds && circuitIds.length > 0
        ? { create: circuitIds.map((id) => ({ circuitId: parseInt(id) })) }
        : undefined,
      features: features && features.length > 0
        ? {
            create: features.map((f) =>
              typeof f === 'string'
                ? { feature: f }
                : { feature: f.feature, description: f.description || null }
            ),
          }
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
  const formattedRest = formatPlaceFields(rest);
  if (formattedRest.name && formattedRest.name !== existing.name) {
    formattedRest.slug = slugify(formattedRest.name, { lower: true, strict: true });
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
        data: features.map((f) =>
          typeof f === 'string'
            ? { placeId, feature: f }
            : { placeId, feature: f.feature, description: f.description || null }
        ),
      });
    }
  }

  return prisma.place.update({
    where: { id: placeId },
    data: formattedRest,
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
