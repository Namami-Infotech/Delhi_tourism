const { body } = require('express-validator');

const createEventValidator = [
  body('title').trim().notEmpty().withMessage('Event title is required.').isLength({ max: 200 }),
  body('description').optional().trim(),
  body('startDate').isISO8601().withMessage('startDate must be a valid ISO8601 date.'),
  body('endDate').optional().isISO8601().withMessage('endDate must be a valid ISO8601 date.'),
  body('venue').optional().trim(),
  body('address').optional().trim(),
  body('coverImage').optional().trim(),
  body('category').optional().trim(),
  body('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean.'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean.'),
];

const updateEventValidator = [
  body('title').optional().trim().notEmpty().withMessage('Event title cannot be empty.').isLength({ max: 200 }),
  body('description').optional().trim(),
  body('startDate').optional().isISO8601().withMessage('startDate must be a valid ISO8601 date.'),
  body('endDate').optional().isISO8601().withMessage('endDate must be a valid ISO8601 date.'),
  body('venue').optional().trim(),
  body('address').optional().trim(),
  body('coverImage').optional().trim(),
  body('category').optional().trim(),
  body('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean.'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean.'),
];

module.exports = {
  createEventValidator,
  updateEventValidator,
};
