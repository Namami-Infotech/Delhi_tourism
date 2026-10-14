const circuitService = require('../services/circuit.service');

const getAll = async (req, res, next) => {
  try {
    const circuits = await circuitService.getAll(req.query);
    res.status(200).json({ success: true, data: circuits });
  } catch (err) {
    next(err);
  }
};

const getBySlug = async (req, res, next) => {
  try {
    const circuit = await circuitService.getBySlug(req.params.slug);
    res.status(200).json({ success: true, data: circuit });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const circuit = await circuitService.create(req.body);
    res.status(201).json({ success: true, data: circuit });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const circuit = await circuitService.update(req.params.id, req.body);
    res.status(200).json({ success: true, data: circuit });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await circuitService.remove(req.params.id);
    res.status(200).json({ success: true, message: 'Circuit deactivated.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getBySlug, create, update, remove };
