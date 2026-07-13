const Product = require('../models/Product');
const { asyncHandler } = require('../middlewares/errorHandler');

/** GET /about - static company story page, with a live product count for a dynamic touch */
const renderAbout = asyncHandler(async (req, res) => {
  const productCount = await Product.countDocuments({});

  res.render('about', {
    title: 'About Us - Fruitables',
    productCount,
  });
});

module.exports = { renderAbout };
