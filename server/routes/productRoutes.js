// server/routes/productRoutes.js

import express from 'express';
import Product from '../models/Product.js'; // Import the Product model

const router = express.Router();

// @route   POST api/products
// @desc    Create a new product
// @access  Public (will be private with auth later)
router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct); // 201 Created
  } catch (error) {
    // Mongoose validation errors have a 'name' of 'ValidationError'
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    // Handle duplicate SKU error (MongoDB unique index error code is 11000)
    if (error.code === 11000 && error.keyPattern && error.keyPattern.sku) {
      return res.status(400).json({ message: 'SKU must be unique. A product with this SKU already exists.' });
    }
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET api/products
// @desc    Get all products
// @access  Public (will be private with auth later)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET api/products/:id
// @desc    Get a single product by ID
// @access  Public (will be private with auth later)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' }); // 404 Not Found
    }
    res.status(200).json(product);
  } catch (error) {
    // Handle invalid MongoDB ID format
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE api/products/:id
// @desc    Delete a product by ID
// @access  Public (will be private with auth later)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' }); // 404 Not Found
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    // Handle invalid MongoDB ID format
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;