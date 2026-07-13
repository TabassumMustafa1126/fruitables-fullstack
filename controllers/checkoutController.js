const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const { calcDiscount } = require('../utils/couponUtils');
const { asyncHandler } = require('../middlewares/errorHandler');

function calcTotals(cart, coupon) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cart.length > 0 ? 150 : 0;
  const discount = calcDiscount(coupon, subtotal);
  const total = subtotal + shipping - discount;
  return { subtotal, shipping, discount, total };
}

/** GET /checkout - Show checkout form pre-filled with the cart summary */
const renderCheckout = (req, res) => {
  if (!req.session.cart || req.session.cart.length === 0) {
    return res.redirect('/cart');
  }

  const coupon = req.session.coupon || null;
  const { subtotal, shipping, discount, total } = calcTotals(req.session.cart, coupon);
  res.render('checkout', {
    title: 'Checkout - Fruitables',
    cart: req.session.cart,
    subtotal,
    shipping,
    discount,
    total,
    coupon,
    errors: [],
  });
};

/** POST /checkout - Validate form, persist an Order to MongoDB, clear the cart */
const placeOrder = asyncHandler(async (req, res) => {
  const cart = req.session.cart || [];

  if (cart.length === 0) {
    return res.redirect('/cart');
  }

  const coupon = req.session.coupon || null;
  const { customerName, email, phone, address, city, paymentMethod } = req.body;
  const { subtotal, shipping, discount, total } = calcTotals(cart, coupon);

  const order = new Order({
    customerName,
    email,
    phone,
    address,
    city,
    paymentMethod: paymentMethod || 'cod',
    items: cart.map((item) => ({
      product: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
    couponCode: coupon ? coupon.code : undefined,
    discountAmount: discount,
    totalAmount: total,
  });

  try {
    await order.save();
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).render('checkout', {
        title: 'Checkout - Fruitables',
        cart,
        subtotal,
        shipping,
        discount,
        total,
        coupon,
        errors,
      });
    }
    throw err;
  }

  // Coupon redemption succeeded with the order - count it as used so
  // usageLimit is enforced across all customers.
  if (coupon && coupon.couponId) {
    await Coupon.findByIdAndUpdate(coupon.couponId, { $inc: { usedCount: 1 } });
  }

  req.session.cart = [];
  req.session.coupon = null;
  res.render('order-success', {
    title: 'Order Confirmed - Fruitables',
    order,
  });
});

module.exports = { renderCheckout, placeOrder };
