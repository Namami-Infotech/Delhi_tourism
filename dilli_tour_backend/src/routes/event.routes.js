const express = require('express');
const eventController = require('../controllers/event.controller');
const { protect, restrict } = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const {
  createEventValidator,
  updateEventValidator,
} = require('../validators/event.validator');

const router = express.Router();

router.get('/', eventController.getAll);
router.get('/:slug', eventController.getBySlug);

router.post(
  '/',
  protect,
  restrict('SUPER_ADMIN', 'ADMIN'),
  createEventValidator,
  validate,
  eventController.create
);

router.put(
  '/:id',
  protect,
  restrict('SUPER_ADMIN', 'ADMIN'),
  updateEventValidator,
  validate,
  eventController.update
);

router.delete('/:id', protect, restrict('SUPER_ADMIN', 'ADMIN'), eventController.remove);

module.exports = router;
