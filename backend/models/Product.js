const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subtitle: String,
    price: { type: Number, required: true },
    originalPrice: Number,
    category: String,
    sku: String,
    colors: [{ name: String, hex: String }],
    sizes: [{ label: String, inStock: Boolean }],
    features: [String],
    badge: String,
    rating: { score: Number, count: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
