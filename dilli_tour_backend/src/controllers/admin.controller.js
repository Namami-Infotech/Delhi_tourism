const adminService = require('../services/admin.service');

const getStats = async (_req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (_req, res, next) => {
  try {
    const users = await adminService.getAllAdmins();
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await adminService.getAdminById(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const user = await adminService.createAdmin(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await adminService.updateAdmin(req.params.id, req.body);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const removeUser = async (req, res, next) => {
  try {
    await adminService.removeAdmin(req.params.id);
    res.status(200).json({ success: true, message: 'Admin account deactivated successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStats,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  removeUser,
};
