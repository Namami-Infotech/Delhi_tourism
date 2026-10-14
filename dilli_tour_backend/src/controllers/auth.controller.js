const authService = require('../services/auth.service');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const me = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: req.admin });
  } catch (err) {
    next(err);
  }
};

const logout = async (_req, res, next) => {
  try {
    // JWT is stateless; client discards the token.
    res.status(200).json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, me, logout };
