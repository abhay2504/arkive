const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// GET cart by session
router.get('/:sessionId', async (req, res) => {
  try {
    const items = await Cart.find({ sessionId: req.params.sessionId });
    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    res.json({
      success: true,
      items,
      total,
      count: items.reduce((s, i) => s + i.qty, 0),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST add to cart
router.post('/', async (req, res) => {
  try {
    const { sessionId, productId, productName, color, size, price, qty } = req.body;
    let item = await Cart.findOne({ sessionId, productId, color, size });
    if (item) {
      item.qty += qty || 1;
      await item.save();
    } else {
      item = await Cart.create({
        sessionId,
        productId,
        productName,
        color,
        size,
        price,
        qty: qty || 1,
      });
    }
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH update qty
router.patch('/:itemId', async (req, res) => {
  try {
    const item = await Cart.findByIdAndUpdate(
      req.params.itemId,
      { qty: req.body.qty },
      { new: true }
    );
    if (!item)
      return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE remove item
router.delete('/:itemId', async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.itemId);
    res.json({ success: true, message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
