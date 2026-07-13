const express = require('express');
const router = express.Router();
const { renderTestimonials } = require('../controllers/testimonialController');

router.get('/', renderTestimonials);

module.exports = router;
