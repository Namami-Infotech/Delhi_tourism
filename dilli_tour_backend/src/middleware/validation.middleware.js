const { validationResult } = require('express-validator');

/**
 * Runs after express-validator chains.
 * If there are validation errors, returns 422 with error details.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed.',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  return next();
};

module.exports = validate;
