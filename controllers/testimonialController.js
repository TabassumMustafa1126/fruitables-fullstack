const Testimonial = require('../models/Testimonial');
const { asyncHandler } = require('../middlewares/errorHandler');

/** GET /testimonial */
const renderTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
  res.render('testimonial', {
    title: 'Testimonial - Fruitables',
    testimonials,
  });
});

module.exports = { renderTestimonials };
