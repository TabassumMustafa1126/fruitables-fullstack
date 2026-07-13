const Product = require('../models/Product');
const Review = require('../models/Review');
const { asyncHandler } = require('../middlewares/errorHandler');

const PAGE_SIZE = 6;

/**
 * GET /shop - Full product listing with filters:
 *  - ?category=fruit|vegetable
 *  - ?search=keyword
 *  - ?maxPrice=NUMBER (price range slider)
 *  - ?organic=1 (Additional filter checkbox)
 *  - ?onSale=1 (Additional filter checkbox - has an oldPrice)
 *  - ?limit=NUMBER (used by the "View More" button to show more results)
 */
const renderShop = asyncHandler(async (req, res) => {
  const { category, search, maxPrice, organic, onSale } = req.query;
  const limit = Math.max(PAGE_SIZE, parseInt(req.query.limit, 10) || PAGE_SIZE);

  const filter = {};
  if (category && ['fruit', 'vegetable'].includes(category)) {
    filter.category = category;
  }
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }
  if (maxPrice) {
    filter.price = { $lte: Number(maxPrice) };
  }
  if (organic === '1') {
    filter.quality = { $regex: 'organic', $options: 'i' };
  }
  if (onSale === '1') {
    filter.oldPrice = { $ne: null };
  }

  const [matching, fruitCount, vegetableCount, featuredProducts, priciest] = await Promise.all([
    Product.find(filter).sort({ name: 1 }),
    Product.countDocuments({ category: 'fruit' }),
    Product.countDocuments({ category: 'vegetable' }),
    Product.find({}).sort({ rating: -1 }).limit(4),
    Product.findOne({}).sort({ price: -1 }),
  ]);

  const products = matching.slice(0, limit);
  const hasMore = matching.length > products.length;

  res.render('shop', {
    title: 'Fresh Fruits Shop - Fruitables',
    products,
    activeCategory: category || 'all',
    search: search || '',
    categoryCounts: { fruit: fruitCount, vegetable: vegetableCount },
    featuredProducts,
    priceCeiling: priciest ? Math.ceil(priciest.price) : 1000,
    maxPrice: maxPrice || '',
    organic: organic === '1',
    onSale: onSale === '1',
    limit,
    hasMore,
  });
});

/**
 * GET /shop/:id - Single product detail page, with sidebar (search, category
 * counts, featured products), a specs table, customer reviews, and related products.
 */
const renderShopDetail = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }

  const [relatedProducts, reviews, fruitCount, vegetableCount, featuredProducts] = await Promise.all([
    Product.find({ category: product.category, _id: { $ne: product._id } }).limit(4),
    Review.find({ product: product._id }).sort({ createdAt: -1 }),
    Product.countDocuments({ category: 'fruit' }),
    Product.countDocuments({ category: 'vegetable' }),
    Product.find({ _id: { $ne: product._id } }).sort({ rating: -1 }).limit(4),
  ]);

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : product.rating;

  res.render('shop-detail', {
    title: `${product.name} - Fruitables`,
    product,
    relatedProducts,
    reviews,
    avgRating,
    categoryCounts: { fruit: fruitCount, vegetable: vegetableCount },
    featuredProducts,
    search: '',
  });
});

/**
 * POST /shop/:id/reviews - Add a customer review ("Leave a Reply") for a product.
 */
const addReview = asyncHandler(async (req, res) => {
  const { name, rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }

  await Review.create({ product: product._id, name, rating, comment });
  res.redirect(`/shop/${product._id}#reviews`);
});

module.exports = { renderShop, renderShopDetail, addReview };
