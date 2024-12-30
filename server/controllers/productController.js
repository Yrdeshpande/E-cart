const Product = require('../models/Product');

// Get all products by category
const getAllProducts = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { name, category, price, description, image } = req.body;
    const product = new Product({ name, category, price, description, image });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product' });
  }
};

module.exports = { getAllProducts, getProductById, createProduct };
