const express = require('express');
const galleryController = require('../controllers/gallery.controller');
const { protect, restrict } = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const {
  createGalleryValidator,
  updateGalleryValidator,
} = require('../validators/gallery.validator');

const router = express.Router();

router.get('/', galleryController.getAll);
router.get('/:id', galleryController.getById);

router.post(
  '/',
  protect,
  restrict('SUPER_ADMIN', 'ADMIN', 'EDITOR'),
  createGalleryValidator,
  validate,
  galleryController.create
);

router.put(
  '/:id',
  protect,
  restrict('SUPER_ADMIN', 'ADMIN', 'EDITOR'),
  updateGalleryValidator,
  validate,
  galleryController.update
);

router.delete(
  '/:id',
  protect,
  restrict('SUPER_ADMIN', 'ADMIN'),
  galleryController.remove
);

module.exports = router;
