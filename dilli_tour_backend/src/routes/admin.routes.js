const express = require('express');
const adminController = require('../controllers/admin.controller');
const { protect, restrict } = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const {
  createAdminValidator,
  updateAdminValidator,
} = require('../validators/admin.validator');

const router = express.Router();

// Dashboard overview stats
router.get('/stats', protect, adminController.getStats);

// Admin user management (SUPER_ADMIN only)
router.get('/users', protect, restrict('SUPER_ADMIN'), adminController.getAllUsers);
router.get('/users/:id', protect, restrict('SUPER_ADMIN'), adminController.getUserById);
router.post(
  '/users',
  protect,
  restrict('SUPER_ADMIN'),
  createAdminValidator,
  validate,
  adminController.createUser
);
router.put(
  '/users/:id',
  protect,
  restrict('SUPER_ADMIN'),
  updateAdminValidator,
  validate,
  adminController.updateUser
);
router.delete(
  '/users/:id',
  protect,
  restrict('SUPER_ADMIN'),
  adminController.removeUser
);

module.exports = router;
