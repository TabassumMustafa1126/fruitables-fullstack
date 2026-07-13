const Contact = require('../models/Contact');
const { asyncHandler } = require('../middlewares/errorHandler');

/** GET /contact */
const renderContact = (req, res) => {
  res.render('contact', {
    title: 'Contact - Fruitables',
    errors: [],
    success: false,
    formData: {},
  });
};

/** POST /contact - Save the message to MongoDB */
const submitContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    await Contact.create({ name, email, subject, message });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).render('contact', {
        title: 'Contact - Fruitables',
        errors,
        success: false,
        formData: req.body,
      });
    }
    throw err;
  }

  res.render('contact', {
    title: 'Contact - Fruitables',
    errors: [],
    success: true,
    formData: {},
  });
});

module.exports = { renderContact, submitContact };
