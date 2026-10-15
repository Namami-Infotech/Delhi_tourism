const { body } = require("express-validator");

const createPlaceValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Place name is required.")
    .isLength({ max: 200 }),
  body("shortDescription").optional().trim(),
  body("description").optional().trim(),
  body("historicalInformation").optional().trim(),
  body("address").optional().trim(),
  body("locality").optional().trim(),
  body("latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be a valid float between -90 and 90."),
  body("longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be a valid float between -180 and 180."),
  body("openingTime").optional().trim(),
  body("closingTime").optional().trim(),
  body("ticketInformation").optional().trim(),
  body("contactInformation").optional().trim(),
  // body('website').optional().trim().isURL().withMessage('Website must be a valid URL.'),
  body("coverImage").optional().trim(),
  body("imageUrl").optional().trim(),
  body("icon").optional().trim(),
  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be a boolean."),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean."),
  body("categoryIds")
    .optional()
    .isArray()
    .withMessage("categoryIds must be an array of integers."),
  body("circuitIds")
    .optional()
    .isArray()
    .withMessage("circuitIds must be an array of integers."),
  body("features")
    .optional()
    .isArray()
    .withMessage("features must be an array of feature strings."),
];

const updatePlaceValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Place name cannot be empty.")
    .isLength({ max: 200 }),
  body("shortDescription").optional().trim(),
  body("description").optional().trim(),
  body("historicalInformation").optional().trim(),
  body("address").optional().trim(),
  body("locality").optional().trim(),
  body("latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be a valid float between -90 and 90."),
  body("longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be a valid float between -180 and 180."),
  body("openingTime").optional().trim(),
  body("closingTime").optional().trim(),
  body("ticketInformation").optional().trim(),
  body("contactInformation").optional().trim(),
  // body("website")
  //   .optional()
  //   .trim()
  //   .isURL()
  //   .withMessage("Website must be a valid URL."),
  body("coverImage").optional().trim(),
  body("imageUrl").optional().trim(),
  body("icon").optional().trim(),
  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be a boolean."),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean."),
  body("categoryIds")
    .optional()
    .isArray()
    .withMessage("categoryIds must be an array of integers."),
  body("circuitIds")
    .optional()
    .isArray()
    .withMessage("circuitIds must be an array of integers."),
  body("features")
    .optional()
    .isArray()
    .withMessage("features must be an array of feature strings."),
];

module.exports = {
  createPlaceValidator,
  updatePlaceValidator,
};
