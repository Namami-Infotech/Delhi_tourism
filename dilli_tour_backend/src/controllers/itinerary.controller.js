const itineraryService = require('../services/itinerary.service');

const getAll = async (req, res, next) => {
  try {
    const itineraries = await itineraryService.getAll(req.query);
    res.status(200).json({ success: true, data: itineraries });
  } catch (err) {
    next(err);
  }
};

const getBySlug = async (req, res, next) => {
  try {
    const itinerary = await itineraryService.getBySlug(req.params.slug);
    res.status(200).json({ success: true, data: itinerary });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const itinerary = await itineraryService.create(req.body);
    res.status(201).json({ success: true, data: itinerary });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const itinerary = await itineraryService.update(req.params.id, req.body);
    res.status(200).json({ success: true, data: itinerary });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await itineraryService.remove(req.params.id);
    res.status(200).json({ success: true, message: 'Itinerary deactivated.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getBySlug, create, update, remove };
