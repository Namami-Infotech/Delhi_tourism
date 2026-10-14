/**
 * Shared utility helpers.
 */

/**
 * Creates a standardised AppError with an HTTP status code.
 * Usage: throw createError(404, 'Place not found.')
 */
const createError = (statusCode, message) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

module.exports = { createError };
