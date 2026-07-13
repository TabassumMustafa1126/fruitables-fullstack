const express = require('express');
const router = express.Router();
const {
  renderCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  applyCoupon,
  removeCoupon,
} = require('../controllers/cartController');

router.get('/', renderCart);
router.post('/add/:productId', addToCart);
router.post('/update/:productId', updateCartItem);
router.post('/remove/:productId', removeFromCart);
router.post('/apply-coupon', applyCoupon);
router.post('/remove-coupon', removeCoupon);

module.exports = router;
