const prisma = require('../config/database');
const slugify = require('slugify');

const getAll = async (query = {}) => {
  const where = { isActive: true };
  if (query.featured === 'true') {
    where.isFeatured = true;
  }
  if (query.upcoming === 'true') {
    where.endDate = { gte: new Date() };
  }
  return prisma.event.findMany({
    where,
    orderBy: { startDate: 'asc' },
  });
};

const getBySlug = async (slug) => {
  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      galleries: { orderBy: { displayOrder: 'asc' } },
    },
  });
  if (!event) {
    const err = new Error('Event not found.');
    err.statusCode = 404;
    throw err;
  }
  return event;
};

const create = async (data) => {
  const slug = slugify(data.title, { lower: true, strict: true });
  return prisma.event.create({
    data: { ...data, slug },
  });
};

const update = async (id, data) => {
  const existing = await prisma.event.findUnique({ where: { id: parseInt(id) } });
  if (!existing) {
    const err = new Error('Event not found.');
    err.statusCode = 404;
    throw err;
  }
  if (data.title && data.title !== existing.title) {
    data.slug = slugify(data.title, { lower: true, strict: true });
  }
  return prisma.event.update({
    where: { id: parseInt(id) },
    data,
  });
};

const remove = async (id) => {
  const existing = await prisma.event.findUnique({ where: { id: parseInt(id) } });
  if (!existing) {
    const err = new Error('Event not found.');
    err.statusCode = 404;
    throw err;
  }
  return prisma.event.update({
    where: { id: parseInt(id) },
    data: { isActive: false },
  });
};

module.exports = { getAll, getBySlug, create, update, remove };
