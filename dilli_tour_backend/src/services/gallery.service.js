const prisma = require('../config/database');

const getAll = async (query = {}) => {
  const where = {};
  if (query.entityType) {
    where.entityType = query.entityType;
  }
  if (query.entityId) {
    where.entityId = parseInt(query.entityId);
  }
  return prisma.gallery.findMany({
    where,
    orderBy: { displayOrder: 'asc' },
  });
};

const getById = async (id) => {
  const gallery = await prisma.gallery.findUnique({
    where: { id: parseInt(id) },
  });
  if (!gallery) {
    const err = new Error('Gallery image not found.');
    err.statusCode = 404;
    throw err;
  }
  return gallery;
};

const create = async (data) => {
  const entityId = parseInt(data.entityId);
  const galleryData = {
    entityType: data.entityType,
    entityId,
    imageUrl: data.imageUrl,
    title: data.title || null,
    altText: data.altText || null,
    displayOrder: data.displayOrder ? parseInt(data.displayOrder) : 0,
  };

  // Associate optional typed foreign key for referential integrity
  if (data.entityType === 'place') {galleryData.placeId = entityId;}
  else if (data.entityType === 'circuit') {galleryData.circuitId = entityId;}
  else if (data.entityType === 'category') {galleryData.categoryId = entityId;}
  else if (data.entityType === 'event') {galleryData.eventId = entityId;}
  else if (data.entityType === 'itinerary') {galleryData.itineraryId = entityId;}

  return prisma.gallery.create({
    data: galleryData,
  });
};

const update = async (id, data) => {
  const existing = await prisma.gallery.findUnique({ where: { id: parseInt(id) } });
  if (!existing) {
    const err = new Error('Gallery image not found.');
    err.statusCode = 404;
    throw err;
  }

  const updateData = {};
  if (data.imageUrl !== undefined) {updateData.imageUrl = data.imageUrl;}
  if (data.title !== undefined) {updateData.title = data.title;}
  if (data.altText !== undefined) {updateData.altText = data.altText;}
  if (data.displayOrder !== undefined) {updateData.displayOrder = parseInt(data.displayOrder);}

  return prisma.gallery.update({
    where: { id: parseInt(id) },
    data: updateData,
  });
};

const remove = async (id) => {
  const existing = await prisma.gallery.findUnique({ where: { id: parseInt(id) } });
  if (!existing) {
    const err = new Error('Gallery image not found.');
    err.statusCode = 404;
    throw err;
  }
  return prisma.gallery.delete({
    where: { id: parseInt(id) },
  });
};

module.exports = { getAll, getById, create, update, remove };
