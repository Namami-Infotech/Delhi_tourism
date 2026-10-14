const searchService = require('../services/search.service');

const search = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Search query is required.' });
    }
    const results = await searchService.search(q.trim());
    return res.status(200).json({ success: true, data: results });
  } catch (err) {
    return next(err);
  }
};

module.exports = { search };
