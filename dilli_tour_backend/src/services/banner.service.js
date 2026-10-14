const prisma = require('../config/database');
const env = require('../config/env');

/**
 * Format a banner so that relative image paths (e.g. /uploads/banners/...)
 * are prepended with the configured BASE_URL from env when returned to the client.
 */
const formatBanner = (banner) => {
  if (!banner) {
    return banner;
  }

  let fullImageUrl = banner.imageUrl;
  if (banner.imageUrl && banner.imageUrl.startsWith('/uploads/')) {
    const baseUrl = (env.BASE_URL || '').replace(/\/+$/, '');
    fullImageUrl = `${baseUrl}${banner.imageUrl}`;
  }

  return {
    ...banner,
    imageUrl: fullImageUrl,
    rawImageUrl: banner.imageUrl,
  };
};

/**
 * Clean imageUrl before saving to database.
 * If user or frontend provided a full URL pointing to /uploads/,
 * strip the host part so ONLY the relative path (/uploads/banners/...) is saved in the database.
 */
const toRelativeImageUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return imageUrl;
  }

  const uploadIndex = imageUrl.indexOf('/uploads/');
  if (uploadIndex !== -1) {
    return imageUrl.slice(uploadIndex);
  }

  return imageUrl;
};

const getAll = async (query = {}) => {
  const where = {};
  if (query.all !== 'true') {
    where.isActive = true;
  }
  const banners = await prisma.banner.findMany({
    where,
    orderBy: { displayOrder: 'asc' },
  });
  return banners.map(formatBanner);
};

const getById = async (id) => {
  const banner = await prisma.banner.findUnique({
    where: { id: parseInt(id, 10) },
  });
  if (!banner) {
    const err = new Error('Banner not found.');
    err.statusCode = 404;
    throw err;
  }
  return formatBanner(banner);
};

const create = async (data) => {
  const payload = {
    ...data,
    imageUrl: toRelativeImageUrl(data.imageUrl),
    displayOrder: data.displayOrder !== undefined ? parseInt(data.displayOrder, 10) : 0,
    isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
  };
  const banner = await prisma.banner.create({
    data: payload,
  });
  return formatBanner(banner);
};

const update = async (id, data) => {
  const existing = await prisma.banner.findUnique({ where: { id: parseInt(id, 10) } });
  if (!existing) {
    const err = new Error('Banner not found.');
    err.statusCode = 404;
    throw err;
  }
  const payload = { ...data };
  if (payload.imageUrl !== undefined) {
    payload.imageUrl = toRelativeImageUrl(payload.imageUrl);
  }
  if (payload.displayOrder !== undefined) {
    payload.displayOrder = parseInt(payload.displayOrder, 10);
  }
  if (payload.isActive !== undefined) {
    payload.isActive = Boolean(payload.isActive);
  }
  const banner = await prisma.banner.update({
    where: { id: parseInt(id, 10) },
    data: payload,
  });
  return formatBanner(banner);
};

const remove = async (id) => {
  const existing = await prisma.banner.findUnique({ where: { id: parseInt(id, 10) } });
  if (!existing) {
    const err = new Error('Banner not found.');
    err.statusCode = 404;
    throw err;
  }
  const banner = await prisma.banner.update({
    where: { id: parseInt(id, 10) },
    data: { isActive: false },
  });
  return formatBanner(banner);
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  formatBanner,
  toRelativeImageUrl,
};
