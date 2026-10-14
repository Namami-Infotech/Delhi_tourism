const express = require('express');
const circuitController = require('../controllers/circuit.controller');
const { protect, restrict } = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const {
  createCircuitValidator,
  updateCircuitValidator,
} = require('../validators/circuit.validator');

const router = express.Router();

router.get('/', circuitController.getAll);
router.get('/:slug', circuitController.getBySlug);

router.post(
  '/',
  protect,
  restrict('SUPER_ADMIN', 'ADMIN'),
  createCircuitValidator,
  validate,
  circuitController.create
);

router.put(
  '/:id',
  protect,
  restrict('SUPER_ADMIN', 'ADMIN'),
  updateCircuitValidator,
  validate,
  circuitController.update
);

router.delete('/:id', protect, restrict('SUPER_ADMIN', 'ADMIN'), circuitController.remove);

module.exports = router;
