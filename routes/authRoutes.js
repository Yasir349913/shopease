const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getRegister, postRegister, getLogin, postLogin, logout } = require('../controllers/authController');

const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) throw new Error('Passwords do not match');
    return true;
  }),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.get('/register', getRegister);
router.post('/register', registerValidation, postRegister);
router.get('/login', getLogin);
router.post('/login', loginValidation, postLogin);
router.get('/logout', logout);

module.exports = router;
