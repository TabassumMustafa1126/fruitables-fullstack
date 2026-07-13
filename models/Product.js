const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    category: {
      type: String,
      required: true,
      enum: ['fruit', 'vegetable'],
      default: 'vegetable',
    },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    oldPrice: { type: Number, min: 0, default: null },
    unit: { type: String, default: 'kg' },
    image: { type: String, required: true }, // e.g. "fruite-item-1.jpg" (served from /img)
    rating: { type: Number, min: 0, max: 5, default: 4 },
    description: { type: String, default: 'Fresh and organic, sourced directly from local farms.' },
    stock: { type: Number, default: 50, min: 0 },
    origin: { type: String, default: 'Local Farm, Pakistan' },
    quality: { type: String, default: 'Organic' },
    minOrderWeight: { type: Number, default: 1, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
