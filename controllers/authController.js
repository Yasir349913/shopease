const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Set token cookie
const sendTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    secure: process.env.NODE_ENV === 'production',
  };
  res.cookie('token', token, cookieOptions);
};

// GET /auth/register
const getRegister = (req, res) => {
  if (res.locals.currentUser) return res.redirect('/products');
  res.render('auth/register', { title: 'Create Account', errors: [] });
};

// POST /auth/register
const postRegister = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/register', {
      title: 'Create Account',
      errors: errors.array(),
      formData: req.body,
    });
  }

  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('auth/register', {
        title: 'Create Account',
        errors: [{ msg: 'Email already registered. Try logging in.' }],
        formData: req.body,
      });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    req.flash('success', `Welcome, ${user.name}! Your account has been created.`);
    res.redirect('/products');
  } catch (error) {
    console.error(error);
    res.render('auth/register', {
      title: 'Create Account',
      errors: [{ msg: 'Something went wrong. Please try again.' }],
      formData: req.body,
    });
  }
};

// GET /auth/login
const getLogin = (req, res) => {
  if (res.locals.currentUser) return res.redirect('/products');
  res.render('auth/login', { title: 'Sign In', errors: [] });
};

// POST /auth/login
const postLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/login', {
      title: 'Sign In',
      errors: errors.array(),
      formData: req.body,
    });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.render('auth/login', {
        title: 'Sign In',
        errors: [{ msg: 'Invalid email or password.' }],
        formData: req.body,
      });
    }

    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    req.flash('success', `Welcome back, ${user.name}!`);
    res.redirect('/products');
  } catch (error) {
    console.error(error);
    res.render('auth/login', {
      title: 'Sign In',
      errors: [{ msg: 'Something went wrong. Please try again.' }],
      formData: req.body,
    });
  }
};

// GET /auth/logout
const logout = (req, res) => {
  res.clearCookie('token');
  req.flash('success', 'You have been logged out.');
  res.redirect('/auth/login');
};

module.exports = { getRegister, postRegister, getLogin, postLogin, logout };
