const placeService = require('../services/place.service');

const getAll = async (req, res, next) => {
  try {
    const places = await placeService.getAll(req.query);
    res.status(200).json({ success: true, data: places });
  } catch (err) {
    next(err);
  }
};

const getNearby = async (req, res, next) => {
  try {
    const { lat, lon, latitude, longitude, limit, maxDistanceKm, radius, categoryId, circuitId } = req.query;
    const userLat = lat !== undefined ? lat : latitude;
    const userLon = lon !== undefined ? lon : longitude;

    const places = await placeService.getNearbyPlaces({
      lat: userLat,
      lon: userLon,
      limit,
      maxDistanceKm,
      radius,
      categoryId,
      circuitId,
    });

    res.status(200).json({
      success: true,
      count: places.length,
      data: places,
    });
  } catch (err) {
    next(err);
  }
};

const getBySlug = async (req, res, next) => {
  try {
    const place = await placeService.getBySlug(req.params.slug);
    res.status(200).json({ success: true, data: place });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const place = await placeService.create(req.body);
    res.status(201).json({ success: true, data: place });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const place = await placeService.update(req.params.id, req.body);
    res.status(200).json({ success: true, data: place });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await placeService.remove(req.params.id);
    res.status(200).json({ success: true, message: 'Place deactivated.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getNearby, getBySlug, create, update, remove };
