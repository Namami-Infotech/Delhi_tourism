const { body } = require('express-validator');

const loginValidator = [
  body('email').isEmail().withMessage('A valid email address is required.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
];

module.exports = {
  loginValidator,
};
