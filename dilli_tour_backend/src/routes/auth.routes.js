const express = require('express');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const { loginValidator } = require('../validators/auth.validator');

const router = express.Router();

router.post('/login', loginValidator, validate, authController.login);
router.get('/me', protect, authController.me);
router.post('/logout', protect, authController.logout);

module.exports = router;
