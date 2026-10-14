const bannerService = require('../services/banner.service');

const getAll = async (req, res, next) => {
  try {
    const banners = await bannerService.getAll(req.query);
    // console.log(banners);
    res.status(200).json({ success: true, data: banners });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const banner = await bannerService.getById(req.params.id);
    res.status(200).json({ success: true, data: banner });
  } catch (err) {
    next(err);
  }
};

const env = require('../config/env');

const create = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      // Store ONLY the relative path in the database
      data.imageUrl = `/uploads/banners/${req.file.filename}`;
    }
    const banner = await bannerService.create(data);
    res.status(201).json({ success: true, data: banner });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      // Store ONLY the relative path in the database
      data.imageUrl = `/uploads/banners/${req.file.filename}`;
    }
    const banner = await bannerService.update(req.params.id, data);
    res.status(200).json({ success: true, data: banner });
  } catch (err) {
    next(err);
  }
};

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      const err = new Error('No image file provided.');
      err.statusCode = 400;
      throw err;
    }
    const baseUrl = (env.BASE_URL || '').replace(/\/+$/, '');
    const relativePath = `/uploads/banners/${req.file.filename}`;
    const imageUrl = `${baseUrl}${relativePath}`;

    res.status(200).json({
      success: true,
      message: 'Banner image uploaded successfully.',
      data: {
        imageUrl,
        relativePath,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await bannerService.remove(req.params.id);
    res.status(200).json({ success: true, message: 'Banner deactivated.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  uploadImage,
  remove,
};
