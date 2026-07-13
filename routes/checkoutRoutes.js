const express = require('express');
const router = express.Router();
const { renderCheckout, placeOrder } = require('../controllers/checkoutController');

router.get('/', renderCheckout);
router.post('/', placeOrder);

module.exports = router;
