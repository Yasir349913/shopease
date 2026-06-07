const User = require('../models/User');
const Product = require('../models/Product');

// GET /cart — view cart
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');

    // Filter out any cart items where product was deleted
    const validCart = user.cart.filter((item) => item.product !== null);
    if (validCart.length !== user.cart.length) {
      user.cart = validCart;
      await user.save();
    }

    const cartTotal = validCart.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    res.render('cart/index', {
      title: 'My Cart',
      cartItems: validCart,
      cartTotal: cartTotal.toFixed(2),
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to load cart.');
    res.redirect('/products');
  }
};

// POST /cart/add/:productId — add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const quantity = parseInt(req.body.quantity) || 1;

    const product = await Product.findById(productId);
    if (!product) {
      req.flash('error', 'Product not found.');
      return res.redirect('/products');
    }

    if (product.stock < quantity) {
      req.flash('error', 'Not enough stock available.');
      return res.redirect(`/products/${productId}`);
    }

    const user = await User.findById(req.user._id);
    const existingItem = user.cart.find((item) => item.product.toString() === productId);

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (newQty > product.stock) {
        req.flash('error', `Only ${product.stock} items in stock.`);
        return res.redirect(`/products/${productId}`);
      }
      existingItem.quantity = newQty;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    req.flash('success', `"${product.name}" added to your cart!`);
    res.redirect('/cart');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to add item to cart.');
    res.redirect('/products');
  }
};

// POST /cart/update/:productId — update item quantity
const updateCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const quantity = parseInt(req.body.quantity);

    if (quantity < 1) {
      req.flash('error', 'Quantity must be at least 1.');
      return res.redirect('/cart');
    }

    const product = await Product.findById(productId);
    if (!product) {
      req.flash('error', 'Product not found.');
      return res.redirect('/cart');
    }

    if (quantity > product.stock) {
      req.flash('error', `Only ${product.stock} items in stock.`);
      return res.redirect('/cart');
    }

    const user = await User.findById(req.user._id);
    const item = user.cart.find((item) => item.product.toString() === productId);

    if (!item) {
      req.flash('error', 'Item not in cart.');
      return res.redirect('/cart');
    }

    item.quantity = quantity;
    await user.save();
    req.flash('success', 'Cart updated.');
    res.redirect('/cart');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to update cart.');
    res.redirect('/cart');
  }
};

// POST /cart/remove/:productId — remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter((item) => item.product.toString() !== productId);
    await user.save();

    req.flash('success', 'Item removed from cart.');
    res.redirect('/cart');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to remove item.');
    res.redirect('/cart');
  }
};

// POST /cart/clear — clear entire cart
const clearCart = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { cart: [] });
    req.flash('success', 'Cart cleared.');
    res.redirect('/cart');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to clear cart.');
    res.redirect('/cart');
  }
};

module.exports = { getCart, addToCart, updateCart, removeFromCart, clearCart };
