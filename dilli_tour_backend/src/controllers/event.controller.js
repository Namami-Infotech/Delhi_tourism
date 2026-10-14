const eventService = require('../services/event.service');

const getAll = async (req, res, next) => {
  try {
    const events = await eventService.getAll(req.query);
    res.status(200).json({ success: true, data: events });
  } catch (err) {
    next(err);
  }
};

const getBySlug = async (req, res, next) => {
  try {
    const event = await eventService.getBySlug(req.params.slug);
    res.status(200).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const event = await eventService.create(req.body);
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const event = await eventService.update(req.params.id, req.body);
    res.status(200).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await eventService.remove(req.params.id);
    res.status(200).json({ success: true, message: 'Event deactivated.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getBySlug, create, update, remove };
