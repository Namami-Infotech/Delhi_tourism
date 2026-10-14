const homeService = require('../services/home.service');

const getHome = async (req, res, next) => {
  try {
    const { lat, lon, latitude, longitude } = req.query;
    const userLat = lat !== undefined ? lat : latitude;
    const userLon = lon !== undefined ? lon : longitude;
    const coords =
      userLat !== undefined && userLon !== undefined
        ? { lat: userLat, lon: userLon, ...req.query }
        : null;

    const data = await homeService.getHomeData(coords);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getNearbyPlaces = async (req, res, next) => {
  try {
    const { lat, lon, latitude, longitude, limit, maxDistanceKm, radius, categoryId, circuitId } = req.query;
    const userLat = lat !== undefined ? lat : latitude;
    const userLon = lon !== undefined ? lon : longitude;

    const places = await homeService.getNearbyPlaces({
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

module.exports = {
  getHome,
  getNearbyPlaces,
};

