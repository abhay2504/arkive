const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all products
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;
    const query = {};
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    const products = await Product.find(query);
    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST seed products (for demo)
router.post('/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    const products = [
      {
        name: 'Structured Wool Overcoat',
        subtitle: 'Premium outerwear',
        price: 8499,
        originalPrice: 11999,
        category: 'Jackets',
        sku: 'ARK-OC-2401',
        colors: [
          { name: 'Camel', hex: '#C9A96E' },
          { name: 'Charcoal', hex: '#2C2C2A' },
          { name: 'Stone', hex: '#8A8680' },
          { name: 'Burgundy', hex: '#4A1B0C' },
        ],
        sizes: [
          { label: 'XS', inStock: false },
          { label: 'S', inStock: true },
          { label: 'M', inStock: true },
          { label: 'L', inStock: true },
          { label: 'XL', inStock: true },
          { label: 'XXL', inStock: false },
        ],
        features: [
          '100% Virgin Wool — Sourced from New Zealand',
          'Fully lined with cupro satin',
          'Free shipping on orders above ₹2,000',
          '30-day returns & exchanges',
        ],
        badge: 'New Season',
        rating: { score: 4.8, count: 124 },
      },
      {
        name: 'Linen Blend Blazer',
        subtitle: 'Summer collection',
        price: 5999,
        originalPrice: 7999,
        category: 'Blazers',
        sku: 'ARK-BL-2402',
        colors: [
          { name: 'Ivory', hex: '#F5F0E8' },
          { name: 'Navy', hex: '#1B2A4A' },
        ],
        sizes: [
          { label: 'S', inStock: true },
          { label: 'M', inStock: true },
          { label: 'L', inStock: false },
          { label: 'XL', inStock: true },
        ],
        features: [
          '70% Linen, 30% Cotton blend',
          'Unlined for breathability',
          'Two button closure',
        ],
        badge: 'Bestseller',
        rating: { score: 4.6, count: 89 },
      },
    ];
    const inserted = await Product.insertMany(products);
    res.json({
      success: true,
      message: `Seeded ${inserted.length} products`,
      data: inserted,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
