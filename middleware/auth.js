const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes — must be logged in
const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      req.flash('error', 'Please log in to access this page');
      return res.redirect('/auth/login');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      res.clearCookie('token');
      req.flash('error', 'User not found. Please log in again.');
      return res.redirect('/auth/login');
    }

    // Make user available in all EJS templates
    res.locals.currentUser = req.user;
    next();
  } catch (error) {
    res.clearCookie('token');
    req.flash('error', 'Session expired. Please log in again.');
    res.redirect('/auth/login');
  }
};

// Admin-only routes
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  req.flash('error', 'Access denied. Admins only.');
  res.redirect('/products');
};

// Set currentUser for all views (even public pages)
const setCurrentUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.currentUser = await User.findById(decoded.id).select('-password');
    } else {
      res.locals.currentUser = null;
    }
  } catch {
    res.locals.currentUser = null;
  }
  next();
};

module.exports = { protect, adminOnly, setCurrentUser };
