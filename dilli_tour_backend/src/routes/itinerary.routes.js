const express = require('express');
const itineraryController = require('../controllers/itinerary.controller');
const { protect, restrict } = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const {
  createItineraryValidator,
  updateItineraryValidator,
} = require('../validators/itinerary.validator');

const router = express.Router();

router.get('/', itineraryController.getAll);
router.get('/:slug', itineraryController.getBySlug);

router.post(
  '/',
  protect,
  restrict('SUPER_ADMIN', 'ADMIN'),
  createItineraryValidator,
  validate,
  itineraryController.create
);

router.put(
  '/:id',
  protect,
  restrict('SUPER_ADMIN', 'ADMIN'),
  updateItineraryValidator,
  validate,
  itineraryController.update
);

router.delete('/:id', protect, restrict('SUPER_ADMIN', 'ADMIN'), itineraryController.remove);

module.exports = router;
