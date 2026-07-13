/**
 * Pure helper shared by cartController and checkoutController so the
 * discount math never drifts out of sync between the two pages.
 *
 * `coupon` here is the small plain object we store in req.session.coupon
 * (not the full Mongoose document) - see cartController.applyCoupon.
 */
function calcDiscount(coupon, subtotal) {
  if (!coupon || subtotal <= 0) return 0;

  if (coupon.minPurchase && subtotal < coupon.minPurchase) {
    return 0;
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (subtotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
  } else {
    discount = coupon.discountValue;
  }

  // Never let the discount exceed the subtotal itself.
  return Math.min(discount, subtotal);
}

module.exports = { calcDiscount };
