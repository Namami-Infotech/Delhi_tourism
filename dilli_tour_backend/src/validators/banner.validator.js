const { body } = require('express-validator');

const createBannerValidator = [
  body('imageUrl')
    .custom((value, { req }) => {
      if (req.file) {
        return true;
      }
      if (!value || typeof value !== 'string' || value.trim().length === 0) {
        throw new Error('Image URL or an uploaded image file is required.');
      }
      return true;
    }),
  body('title').optional().trim().isLength({ max: 200 }),
  body('subtitle').optional().trim().isLength({ max: 300 }),
  body('linkUrl').optional().trim(),
  body('theme')
    .optional()
    .trim()
    .isIn(['LIGHT', 'DARK'])
    .withMessage('Theme must be either LIGHT or DARK.'),
  body('displayOrder')
    .optional()
    .customSanitizer((val) => (val !== undefined && val !== '' ? parseInt(val, 10) : undefined))
    .isInt({ min: 0 })
    .withMessage('displayOrder must be a positive integer.'),
  body('isActive')
    .optional()
    .customSanitizer((val) => {
      if (val === 'true' || val === true || val === 1 || val === '1') {
        return true;
      }
      if (val === 'false' || val === false || val === 0 || val === '0') {
        return false;
      }
      return val;
    })
    .isBoolean()
    .withMessage('isActive must be a boolean.'),
];

const updateBannerValidator = [
  body('imageUrl').optional().trim(),
  body('title').optional().trim().isLength({ max: 200 }),
  body('subtitle').optional().trim().isLength({ max: 300 }),
  body('linkUrl').optional().trim(),
  body('theme')
    .optional()
    .trim()
    .isIn(['LIGHT', 'DARK'])
    .withMessage('Theme must be either LIGHT or DARK.'),
  body('displayOrder')
    .optional()
    .customSanitizer((val) => (val !== undefined && val !== '' ? parseInt(val, 10) : undefined))
    .isInt({ min: 0 })
    .withMessage('displayOrder must be a positive integer.'),
  body('isActive')
    .optional()
    .customSanitizer((val) => {
      if (val === 'true' || val === true || val === 1 || val === '1') {
        return true;
      }
      if (val === 'false' || val === false || val === 0 || val === '0') {
        return false;
      }
      return val;
    })
    .isBoolean()
    .withMessage('isActive must be a boolean.'),
];

module.exports = {
  createBannerValidator,
  updateBannerValidator,
};
