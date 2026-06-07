const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getCart, addToCart, updateCart, removeFromCart, clearCart } = require('../controllers/cartController');

router.use(protect); // All cart routes require login

router.get('/', getCart);
router.post('/add/:productId', addToCart);
router.post('/update/:productId', updateCart);
router.post('/remove/:productId', removeFromCart);
router.post('/clear', clearCart);

module.exports = router;
