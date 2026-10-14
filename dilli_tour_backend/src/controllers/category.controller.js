const categoryService = require('../services/category.service');

const getAll = async (req, res, next) => {
  try {
    const categories = await categoryService.getAll(req.query);
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

const getBySlug = async (req, res, next) => {
  try {
    const category = await categoryService.getBySlug(req.params.slug);
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const category = await categoryService.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const category = await categoryService.update(req.params.id, req.body);
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await categoryService.remove(req.params.id);
    res.status(200).json({ success: true, message: 'Category deactivated.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getBySlug, create, update, remove };
