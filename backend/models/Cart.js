const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: String,
    color: String,
    size: String,
    price: Number,
    qty: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartItemSchema);
