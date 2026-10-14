const galleryService = require('../services/gallery.service');

const getAll = async (req, res, next) => {
  try {
    const items = await galleryService.getAll(req.query);
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const item = await galleryService.getById(req.params.id);
    res.status(200).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const item = await galleryService.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const item = await galleryService.update(req.params.id, req.body);
    res.status(200).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await galleryService.remove(req.params.id);
    res.status(200).json({ success: true, message: 'Gallery image deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove };
