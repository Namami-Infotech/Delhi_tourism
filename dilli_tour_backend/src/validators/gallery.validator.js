const { body } = require('express-validator');

const validEntityTypes = ['place', 'circuit', 'category', 'event', 'itinerary'];

const createGalleryValidator = [
  body('entityType').isIn(validEntityTypes).withMessage(`entityType must be one of: ${validEntityTypes.join(', ')}`),
  body('entityId').isInt({ min: 1 }).withMessage('entityId must be a valid positive integer.'),
  body('imageUrl').trim().notEmpty().withMessage('imageUrl is required.').isURL().withMessage('imageUrl must be a valid URL.'),
  body('title').optional().trim(),
  body('altText').optional().trim(),
  body('displayOrder').optional().isInt({ min: 0 }).withMessage('displayOrder must be a positive integer.'),
];

const updateGalleryValidator = [
  body('imageUrl').optional().trim().notEmpty().withMessage('imageUrl cannot be empty.').isURL().withMessage('imageUrl must be a valid URL.'),
  body('title').optional().trim(),
  body('altText').optional().trim(),
  body('displayOrder').optional().isInt({ min: 0 }).withMessage('displayOrder must be a positive integer.'),
];

module.exports = {
  createGalleryValidator,
  updateGalleryValidator,
};
