const express = require('express');
const bannerController = require('../controllers/banner.controller');
const { protect, restrict } = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const { uploadBannerImage } = require('../middleware/upload.middleware');
const {
  createBannerValidator,
  updateBannerValidator,
} = require('../validators/banner.validator');

const router = express.Router();

router.get('/', bannerController.getAll);
router.get('/:id', bannerController.getById);

// Upload a local banner image directly
router.post(
  '/upload',
  protect,
  restrict('SUPER_ADMIN', 'ADMIN'),
  uploadBannerImage,
  bannerController.uploadImage
);

router.post(
  '/',
  protect,
  restrict('SUPER_ADMIN', 'ADMIN'),
  uploadBannerImage,
  createBannerValidator,
  validate,
  bannerController.create
);

router.put(
  '/:id',
  protect,
  restrict('SUPER_ADMIN', 'ADMIN'),
  uploadBannerImage,
  updateBannerValidator,
  validate,
  bannerController.update
);

router.delete('/:id', protect, restrict('SUPER_ADMIN', 'ADMIN'), bannerController.remove);

module.exports = router;
