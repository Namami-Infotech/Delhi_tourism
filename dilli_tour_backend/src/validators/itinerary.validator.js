const { body } = require('express-validator');

const createItineraryValidator = [
  body('title').trim().notEmpty().withMessage('Itinerary title is required.').isLength({ max: 200 }),
  body('description').optional().trim(),
  body('duration').optional().trim(),
  body('coverImage').optional().trim(),
  body('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean.'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean.'),
  body('stops').optional().isArray().withMessage('stops must be an array of itinerary stops.'),
  body('stops.*.placeId').optional().isInt({ min: 1 }).withMessage('placeId must be an integer.'),
  body('stops.*.day').optional().isInt({ min: 1 }).withMessage('day must be an integer >= 1.'),
  body('stops.*.sequence').optional().isInt({ min: 0 }).withMessage('sequence must be an integer >= 0.'),
  body('stops.*.estimatedDuration').optional().trim(),
  body('stops.*.notes').optional().trim(),
];

const updateItineraryValidator = [
  body('title').optional().trim().notEmpty().withMessage('Itinerary title cannot be empty.').isLength({ max: 200 }),
  body('description').optional().trim(),
  body('duration').optional().trim(),
  body('coverImage').optional().trim(),
  body('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean.'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean.'),
  body('stops').optional().isArray().withMessage('stops must be an array of itinerary stops.'),
];

module.exports = {
  createItineraryValidator,
  updateItineraryValidator,
};
