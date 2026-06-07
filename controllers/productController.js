const { validationResult } = require('express-validator');
const Product = require('../models/Product');

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Food', 'Other'];

// GET /products — list all products
const getAllProducts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    let query = {};

    if (search) query.name = { $regex: search, $options: 'i' };
    if (category && category !== 'All') query.category = category;

    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };
    if (sort === 'name') sortOption = { name: 1 };

    const products = await Product.find(query).sort(sortOption).populate('createdBy', 'name');

    res.render('products/index', {
      title: 'Shop',
      products,
      categories: ['All', ...CATEGORIES],
      currentCategory: category || 'All',
      currentSort: sort || '',
      searchQuery: search || '',
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to load products.');
    res.redirect('/');
  }
};

// GET /products/new — form to add product (admin)
const getNewProduct = (req, res) => {
  res.render('products/form', {
    title: 'Add New Product',
    product: {},
    categories: CATEGORIES,
    errors: [],
    action: '/products',
    method: 'POST',
  });
};

// POST /products — create product (admin)
const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('products/form', {
      title: 'Add New Product',
      product: req.body,
      categories: CATEGORIES,
      errors: errors.array(),
      action: '/products',
      method: 'POST',
    });
  }

  try {
    const { name, description, price, category, stock, image } = req.body;
    await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image: image || '/images/default-product.png',
      createdBy: req.user._id,
    });

    req.flash('success', `Product "${name}" added successfully!`);
    res.redirect('/products');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to create product.');
    res.redirect('/products/new');
  }
};

// GET /products/:id — view single product
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('createdBy', 'name');
    if (!product) {
      req.flash('error', 'Product not found.');
      return res.redirect('/products');
    }
    res.render('products/show', { title: product.name, product });
  } catch (error) {
    req.flash('error', 'Product not found.');
    res.redirect('/products');
  }
};

// GET /products/:id/edit — edit form (admin)
const getEditProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      req.flash('error', 'Product not found.');
      return res.redirect('/products');
    }
    res.render('products/form', {
      title: 'Edit Product',
      product,
      categories: CATEGORIES,
      errors: [],
      action: `/products/${product._id}?_method=PUT`,
      method: 'POST',
    });
  } catch (error) {
    req.flash('error', 'Product not found.');
    res.redirect('/products');
  }
};

// PUT /products/:id — update product (admin)
const updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const product = await Product.findById(req.params.id);
    return res.render('products/form', {
      title: 'Edit Product',
      product: { ...product.toObject(), ...req.body },
      categories: CATEGORIES,
      errors: errors.array(),
      action: `/products/${req.params.id}?_method=PUT`,
      method: 'POST',
    });
  }

  try {
    const { name, description, price, category, stock, image } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, stock, image },
      { new: true, runValidators: true }
    );

    if (!product) {
      req.flash('error', 'Product not found.');
      return res.redirect('/products');
    }

    req.flash('success', `Product "${product.name}" updated successfully!`);
    res.redirect(`/products/${product._id}`);
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to update product.');
    res.redirect(`/products/${req.params.id}/edit`);
  }
};

// DELETE /products/:id — delete product (admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      req.flash('error', 'Product not found.');
      return res.redirect('/products');
    }
    req.flash('success', `Product "${product.name}" deleted.`);
    res.redirect('/products');
  } catch (error) {
    req.flash('error', 'Failed to delete product.');
    res.redirect('/products');
  }
};

module.exports = {
  getAllProducts,
  getNewProduct,
  createProduct,
  getProduct,
  getEditProduct,
  updateProduct,
  deleteProduct,
};
