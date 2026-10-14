const express = require('express');
const placeController = require('../controllers/place.controller');
const { protect, restrict } = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const {
  createPlaceValidator,
  updatePlaceValidator,
} = require('../validators/place.validator');

const router = express.Router();

router.get('/', placeController.getAll);
router.get('/nearby', placeController.getNearby);
router.get('/:slug', placeController.getBySlug);

router.post(
  '/',
  protect,
  restrict('SUPER_ADMIN', 'ADMIN'),
  createPlaceValidator,
  validate,
  placeController.create
);

router.put(
  '/:id',
  protect,
  restrict('SUPER_ADMIN', 'ADMIN'),
  updatePlaceValidator,
  validate,
  placeController.update
);

router.delete('/:id', protect, restrict('SUPER_ADMIN', 'ADMIN'), placeController.remove);

module.exports = router;
