const express = require('express');
const router = express.Router();
const {
  listCoupons,
  renderNewForm,
  createCoupon,
  renderEditForm,
  updateCoupon,
  deleteCoupon,
} = require('../controllers/adminCouponController');

// method-override (already registered globally in app.js) lets forms send
// ?_method=PUT / ?_method=DELETE since plain HTML forms only support GET/POST.
router.get('/', listCoupons);
router.get('/new', renderNewForm);
router.post('/', createCoupon);
router.get('/:id/edit', renderEditForm);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

module.exports = router;
