const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, adminOnly } = require('../middleware/auth');
const {
  getAllProducts,
  getNewProduct,
  createProduct,
  getProduct,
  getEditProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required').isLength({ max: 100 }).withMessage('Name too long'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').notEmpty().withMessage('Category is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];

router.get('/', getAllProducts);
router.get('/new', protect, adminOnly, getNewProduct);
router.post('/', protect, adminOnly, productValidation, createProduct);
router.get('/:id', getProduct);
router.get('/:id/edit', protect, adminOnly, getEditProduct);
router.put('/:id', protect, adminOnly, productValidation, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
