// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./authentification');
const multer = require('multer');
const Product = require('../models/product');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images/'); // Destination folder for storing images
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + '-' + file.originalname); // Unique filename for each image
  },
});
const upload = multer({ storage: storage });

// Protected route
router.post('/products', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const imageUrl = req.file.filename; // Assuming you want to store the image as base64 string

    const newProduct = new Product({ name, description, price, category, imageUrl });
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a product by ID
router.delete('/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(deletedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
