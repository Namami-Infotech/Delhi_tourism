const express = require('express');
const categoryController = require('../controllers/category.controller');
const { protect, restrict } = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const {
  createCategoryValidator,
  updateCategoryValidator,
} = require('../validators/category.validator');

const router = express.Router();

router.get('/', categoryController.getAll);
router.get('/:slug', categoryController.getBySlug);

router.post(
  '/',
  protect,
  restrict('SUPER_ADMIN', 'ADMIN'),
  createCategoryValidator,
  validate,
  categoryController.create,
);

router.put(
  '/:id',
  protect,
  restrict('SUPER_ADMIN', 'ADMIN'),
  updateCategoryValidator,
  validate,
  categoryController.update,
);

router.delete(
  '/:id',
  protect,
  restrict('SUPER_ADMIN', 'ADMIN'),
  categoryController.remove,
);

module.exports = router;
