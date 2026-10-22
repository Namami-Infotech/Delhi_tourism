const bcrypt = require('bcryptjs');
const prisma = require('../config/database');

/**
 * Returns summary statistics for admin dashboard.
 */
const getDashboardStats = async () => {
  const [
    totalCategories,
    totalCircuits,
    totalPlaces,
    totalEvents,
    totalItineraries,
    featuredPlaces,
    recentPlaces,
    recentCircuits,
    totalBookings,
    revenueAggregate,
    recentBookings,
  ] = await Promise.all([
    prisma.category.count({ where: { isActive: true } }),
    prisma.circuit.count({ where: { isActive: true } }),
    prisma.place.count({ where: { isActive: true } }),
    prisma.event.count({ where: { isActive: true } }),
    prisma.itinerary.count({ where: { isActive: true } }),
    prisma.place.count({ where: { isActive: true, isFeatured: true } }),
    prisma.place.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, slug: true, createdAt: true, isFeatured: true, isActive: true },
    }),
    prisma.circuit.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, slug: true, createdAt: true, isFeatured: true, isActive: true },
    }),
    prisma.booking.count(),
    prisma.booking.aggregate({
      where: { paymentStatus: 'PAID' },
      _sum: { totalAmount: true },
    }),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { place: { select: { name: true } } },
    }),
  ]);

  return {
    totalCategories,
    totalCircuits,
    totalPlaces,
    totalEvents,
    totalItineraries,
    featuredPlaces,
    recentPlaces,
    recentCircuits,
    totalBookings,
    totalRevenue: Number(revenueAggregate._sum.totalAmount || 0),
    recentBookings,
  };
};

/**
 * Admin User CRUD
 */
const getAllAdmins = async () => {
  return prisma.admin.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

const getAdminById = async (id) => {
  const admin = await prisma.admin.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!admin) {
    const err = new Error('Admin user not found.');
    err.statusCode = 404;
    throw err;
  }
  return admin;
};

const createAdmin = async (data) => {
  const existing = await prisma.admin.findUnique({ where: { email: data.email } });
  if (existing) {
    const err = new Error('An account with this email already exists.');
    err.statusCode = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(data.password, 12);
  const newAdmin = await prisma.admin.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role || 'ADMIN',
      isActive: data.isActive !== undefined ? data.isActive : true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  return newAdmin;
};

const updateAdmin = async (id, data) => {
  const adminId = parseInt(id);
  const existing = await prisma.admin.findUnique({ where: { id: adminId } });
  if (!existing) {
    const err = new Error('Admin user not found.');
    err.statusCode = 404;
    throw err;
  }

  const updateData = {};
  if (data.name) {updateData.name = data.name;}
  if (data.email) {
    if (data.email !== existing.email) {
      const emailTaken = await prisma.admin.findUnique({ where: { email: data.email } });
      if (emailTaken) {
        const err = new Error('An account with this email already exists.');
        err.statusCode = 409;
        throw err;
      }
    }
    updateData.email = data.email;
  }
  if (data.password) {
    updateData.passwordHash = await bcrypt.hash(data.password, 12);
  }
  if (data.role) {updateData.role = data.role;}
  if (data.isActive !== undefined) {updateData.isActive = data.isActive;}

  return prisma.admin.update({
    where: { id: adminId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      updatedAt: true,
    },
  });
};

const removeAdmin = async (id) => {
  const adminId = parseInt(id);
  const existing = await prisma.admin.findUnique({ where: { id: adminId } });
  if (!existing) {
    const err = new Error('Admin user not found.');
    err.statusCode = 404;
    throw err;
  }
  return prisma.admin.update({
    where: { id: adminId },
    data: { isActive: false },
    select: { id: true, email: true, isActive: true },
  });
};

module.exports = {
  getDashboardStats,
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  removeAdmin,
};
