const prisma = require("../config/database");
const categoryService = require("./category.service");
const bannerService = require("./banner.service");

/**
 * Calculate the Haversine distance between two coordinates in kilometers.
 *
 * @param {number} lat1 Latitude of first point
 * @param {number} lon1 Longitude of first point
 * @param {number} lat2 Latitude of second point
 * @param {number} lon2 Longitude of second point
 * @returns {number} Distance in kilometers
 */
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (angle) => (angle * Math.PI) / 180;
  const R = 6371; // Earth's radius in kilometers

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Format distance into a friendly human-readable string ("how far they are").
 *
 * @param {number} distanceKm Distance in kilometers
 * @returns {string} Formatted distance string (e.g. "450 m away" or "2.45 km away")
 */
const formatDistanceText = (distanceKm) => {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m away`;
  }
  return `${distanceKm.toFixed(2)} km away`;
};

/**
 * Fetch nearby places in Delhi based on user coordinates (lat, lon).
 *
 * - Calculates distance using the Haversine formula
 * - Sorts from shortest distance to farthest (ascending)
 * - Returns distance, distanceKm, distanceMeters, distanceText, and howFar for each place
 *
 * @param {Object|number} paramsOrLat - Coordinates object or latitude
 * @param {number} [optionalLon] - Longitude (if first parameter is latitude)
 * @param {Object} [options] - Filtering and pagination options
 * @returns {Promise<Array>} Array of places sorted by shortest distance first
 */
const getNearbyPlaces = async (paramsOrLat, optionalLon, options = {}) => {
  let lat;
  let lon;
  let opts = {};

  if (typeof paramsOrLat === "object" && paramsOrLat !== null) {
    lat =
      paramsOrLat.lat !== undefined ? paramsOrLat.lat : paramsOrLat.latitude;
    lon =
      paramsOrLat.lon !== undefined ? paramsOrLat.lon : paramsOrLat.longitude;
    opts = { ...paramsOrLat };
  } else {
    lat = paramsOrLat;
    lon = optionalLon;
    opts = { ...options };
  }

  const userLat = parseFloat(lat);
  const userLon = parseFloat(lon);

  if (isNaN(userLat) || isNaN(userLon)) {
    const err = new Error(
      "Valid latitude and longitude (lat, lon) are required.",
    );
    err.statusCode = 400;
    throw err;
  }

  if (userLat < -90 || userLat > 90 || userLon < -180 || userLon > 180) {
    const err = new Error(
      "Latitude must be between -90 and 90, and longitude between -180 and 180.",
    );
    err.statusCode = 400;
    throw err;
  }

  const where = {
    isActive: true,
    latitude: { not: null },
    longitude: { not: null },
  };

  if (opts.categoryId) {
    where.categories = {
      some: { categoryId: parseInt(opts.categoryId, 10) },
    };
  }

  if (opts.circuitId) {
    where.circuits = {
      some: { circuitId: parseInt(opts.circuitId, 10) },
    };
  }

  const places = await prisma.place.findMany({
    where,
    // include: {
    //   categories: { include: { category: true } },
    //   circuits: { include: { circuit: true } },
    //   galleries: { orderBy: { displayOrder: 'asc' } },
    //   features: true,
    // },
  });

  const parsedMaxDistance =
    opts.maxDistanceKm || opts.radius
      ? parseFloat(opts.maxDistanceKm || opts.radius)
      : null;
  const parsedLimit = opts.limit ? parseInt(opts.limit, 10) : null;

  // Calculate distance for each place and map with distance metrics
  const placesWithDistance = places
    .map((place) => {
      const placeLat = parseFloat(place.latitude);
      const placeLon = parseFloat(place.longitude);

      if (isNaN(placeLat) || isNaN(placeLon)) {
        return null;
      }

      const rawDistKm = calculateDistanceKm(
        userLat,
        userLon,
        placeLat,
        placeLon,
      );
      const distanceKm = parseFloat(rawDistKm.toFixed(2));
      const distanceMeters = Math.round(rawDistKm * 1000);
      const howFar = formatDistanceText(rawDistKm);

      return {
        ...place,
        imageUrl: place.imageUrl || place.coverImage || null,
        distance: distanceKm, // numeric distance in km (shortest distance first)
        distanceKm,
        distanceMeters,
        distanceText:
          distanceKm < 1
            ? `${distanceMeters} m`
            : `${distanceKm.toFixed(2)} km`,
        howFar,
      };
    })
    .filter(Boolean);

  // Sort places so shortest distance is first
  placesWithDistance.sort((a, b) => a.distance - b.distance);

  // Filter by max distance if requested
  let filteredPlaces = placesWithDistance;
  if (
    parsedMaxDistance !== null &&
    !isNaN(parsedMaxDistance) &&
    parsedMaxDistance > 0
  ) {
    filteredPlaces = filteredPlaces.filter(
      (p) => p.distanceKm <= parsedMaxDistance,
    );
  }

  // Apply limit if specified
  if (parsedLimit !== null && !isNaN(parsedLimit) && parsedLimit > 0) {
    filteredPlaces = filteredPlaces.slice(0, parsedLimit);
  }

  return filteredPlaces;
};

/**
 * Fetch data required for the Home page:
 * - Active banners (ordered by displayOrder)
 * - Active categories with places (ordered by displayOrder)
 * - Optional nearby places if coordinates (lat, lon) are provided
 */
const getHomeData = async (coords = null) => {
  const promises = [bannerService.getAll(), categoryService.getAll()];

  const hasCoords =
    coords &&
    (coords.lat !== undefined || coords.latitude !== undefined) &&
    (coords.lon !== undefined || coords.longitude !== undefined);

  if (hasCoords) {
    promises.push(getNearbyPlaces(coords));
  }

  const results = await Promise.all(promises);
  const banners = results[0];
  const categories = results[1];
  const nearbyPlaces = results[2];

  return {
    banners,
    categories,
    ...(hasCoords ? { nearbyPlaces } : {}),
  };
};

module.exports = {
  getHomeData,
  getNearbyPlaces,
  calculateDistanceKm,
  formatDistanceText,
};
