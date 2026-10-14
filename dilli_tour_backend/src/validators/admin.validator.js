const { body } = require('express-validator');

const createAdminValidator = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('Valid email is required.').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  body('role').optional().isIn(['SUPER_ADMIN', 'ADMIN', 'EDITOR']).withMessage('Role must be SUPER_ADMIN, ADMIN, or EDITOR.'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean.'),
];

const updateAdminValidator = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty.'),
  body('email').optional().isEmail().withMessage('Valid email is required.').normalizeEmail(),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  body('role').optional().isIn(['SUPER_ADMIN', 'ADMIN', 'EDITOR']).withMessage('Role must be SUPER_ADMIN, ADMIN, or EDITOR.'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean.'),
];

module.exports = {
  createAdminValidator,
  updateAdminValidator,
};
