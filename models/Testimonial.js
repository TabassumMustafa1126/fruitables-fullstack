const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    profession: { type: String, default: 'Customer' },
    photo: { type: String, default: 'testimonial-1.jpg' },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
