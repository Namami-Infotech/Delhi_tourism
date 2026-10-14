const { body } = require('express-validator');

const createCircuitValidator = [
  body('name').trim().notEmpty().withMessage('Circuit name is required.').isLength({ max: 150 }),
  body('categoryId').isInt({ min: 1 }).withMessage('Valid categoryId is required.'),
  body('tagline').optional().trim(),
  body('shortDescription').optional().trim(),
  body('description').optional().trim(),
  body('coverImage').optional().trim(),
  body('duration').optional().trim(),
  body('bestTime').optional().trim(),
  body('displayOrder').optional().isInt({ min: 0 }).withMessage('displayOrder must be a positive integer.'),
  body('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean.'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean.'),
  body('places').optional().isArray().withMessage('places must be an array of { placeId, sequence }.'),
];

const updateCircuitValidator = [
  body('name').optional().trim().notEmpty().withMessage('Circuit name cannot be empty.').isLength({ max: 150 }),
  body('categoryId').optional().isInt({ min: 1 }).withMessage('Valid categoryId is required.'),
  body('tagline').optional().trim(),
  body('shortDescription').optional().trim(),
  body('description').optional().trim(),
  body('coverImage').optional().trim(),
  body('duration').optional().trim(),
  body('bestTime').optional().trim(),
  body('displayOrder').optional().isInt({ min: 0 }).withMessage('displayOrder must be a positive integer.'),
  body('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean.'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean.'),
  body('places').optional().isArray().withMessage('places must be an array of { placeId, sequence }.'),
];

module.exports = {
  createCircuitValidator,
  updateCircuitValidator,
};
