const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    image: { type: String, required: true }, // filename inside public/img
    excerpt: { type: String, required: [true, 'A short excerpt is required'], trim: true },
    content: { type: String, required: [true, 'Content is required'] },
    author: { type: String, default: 'Fruitables Team' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BlogPost', blogPostSchema);
