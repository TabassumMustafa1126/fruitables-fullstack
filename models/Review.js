const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    name: { type: String, required: [true, 'Name is required'], trim: true },
    rating: { type: Number, required: [true, 'Rating is required'], min: 1, max: 5 },
    comment: { type: String, required: [true, 'A comment is required'], trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
