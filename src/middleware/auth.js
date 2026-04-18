const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getUser = async (token) => {
  if (!token) return null;

  try {
    const bearer = token.startsWith('Bearer ') ? token.slice(7) : token;
    const decoded = jwt.verify(bearer, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    return user;
  } catch (error) {
    return null;
  }
};

const requireAuth = (user) => {
  if (!user) {
    throw new Error('Authentication required. Please log in.');
  }
};

const requireStaff = (user) => {
  requireAuth(user);
  if (user.role !== 'MUNICIPAL_STAFF') {
    throw new Error('Access denied. Municipal staff only.');
  }
};

module.exports = { getUser, requireAuth, requireStaff };
