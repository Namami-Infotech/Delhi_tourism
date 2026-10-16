const prisma = require("../config/database");
const slugify = require("slugify");

//get all good
const getAll = async (query = {}) => {
  const where = { isActive: true };
  if (query.featured === "true") {
    where.isFeatured = true;
  }
  const categories = await prisma.category.findMany({
    where,
    include: {
      galleries: { orderBy: { displayOrder: "asc" } },
      places: {
        where: { place: { isActive: true } },
        include: {
          place: {
            include: {
              galleries: { orderBy: { displayOrder: "asc" } },
              features: true,
            },
          },
        },
      },
    },
    orderBy: { displayOrder: "asc" },
  });

  return categories.map((cat) => ({
    ...cat,
    places: cat.places.map((p) => ({
      ...p.place,
      imageUrl: p.place.imageUrl || p.place.coverImage || null,
      icon: p.place.icon || null,
    })),
  }));
};

const getBySlug = async (slug) => {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      galleries: { orderBy: { displayOrder: "asc" } },
      circuits: {
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
      },
      places: {
        where: { place: { isActive: true } },
        include: {
          place: {
            include: {
              galleries: { orderBy: { displayOrder: "asc" } },
              features: true,
            },
          },
        },
      },
    },
  });
  if (!category) {
    const err = new Error("Category not found.");
    err.statusCode = 404;
    throw err;
  }
  return {
    ...category,
    places: category.places.map((p) => ({
      ...p.place,
      imageUrl: p.place.imageUrl || p.place.coverImage || null,
      icon: p.place.icon || null,
    })),
  };
};

const create = async (data) => {
  const slug = slugify(data.name, { lower: true, strict: true });
  return prisma.category.create({
    data: { ...data, slug },
  });
};

const update = async (id, data) => {
  const existing = await prisma.category.findUnique({
    where: { id: parseInt(id) },
  });
  if (!existing) {
    const err = new Error("Category not found.");
    err.statusCode = 404;
    throw err;
  }
  if (data.name && data.name !== existing.name) {
    data.slug = slugify(data.name, { lower: true, strict: true });
  }
  return prisma.category.update({
    where: { id: parseInt(id) },
    data,
  });
};

const remove = async (id) => {
  const existing = await prisma.category.findUnique({
    where: { id: parseInt(id) },
  });
  if (!existing) {
    const err = new Error("Category not found.");
    err.statusCode = 404;
    throw err;
  }
  // Soft delete
  return prisma.category.update({
    where: { id: parseInt(id) },
    data: { isActive: false },
  });
};

module.exports = { getAll, getBySlug, create, update, remove };
