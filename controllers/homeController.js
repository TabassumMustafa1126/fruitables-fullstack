const Product = require('../models/Product');
const Testimonial = require('../models/Testimonial');
const BlogPost = require('../models/BlogPost');
const { asyncHandler } = require('../middlewares/errorHandler');

/**
 * GET / - Landing page. Pulls a handful of fruits and vegetables to
 * populate the "Fruits Shop" / "Bestseller Products" / counters / testimonial /
 * blog preview sections dynamically.
 */
const renderHome = asyncHandler(async (req, res) => {
  const [fruits, vegetables, bestSellers, testimonials, productCount, latestPosts] = await Promise.all([
    Product.find({ category: 'fruit' }).limit(6).sort({ createdAt: -1 }),
    Product.find({ category: 'vegetable' }).limit(6).sort({ createdAt: -1 }),
    Product.find({}).limit(10).sort({ rating: -1 }),
    Testimonial.find({}).limit(3).sort({ createdAt: -1 }),
    Product.countDocuments({}),
    BlogPost.find({}).limit(3).sort({ createdAt: -1 }),
  ]);

  res.render('index', {
    title: 'Fruitables - Fresh Organic Foods',
    fruits,
    vegetables,
    bestSellers,
    testimonials,
    productCount,
    latestPosts,
  });
});

module.exports = { renderHome };
