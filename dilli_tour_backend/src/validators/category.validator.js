const { body } = require('express-validator');

const createCategoryValidator = [
  body('name').trim().notEmpty().withMessage('Category name is required.').isLength({ max: 100 }),
  body('shortDescription').optional().trim(),
  body('description').optional().trim(),
  body('image').optional().trim(),
  body('icon').optional().trim(),
  body('displayOrder').optional().isInt({ min: 0 }).withMessage('displayOrder must be a positive integer.'),
  body('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean.'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean.'),
];

const updateCategoryValidator = [
  body('name').optional().trim().notEmpty().withMessage('Category name cannot be empty.').isLength({ max: 100 }),
  body('shortDescription').optional().trim(),
  body('description').optional().trim(),
  body('image').optional().trim(),
  body('icon').optional().trim(),
  body('displayOrder').optional().isInt({ min: 0 }).withMessage('displayOrder must be a positive integer.'),
  body('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean.'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean.'),
];

module.exports = {
  createCategoryValidator,
  updateCategoryValidator,
};
