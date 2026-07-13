const Product = require('../models/Product');
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

/** GET /cart - Show the current session cart */
const renderCart = (req, res) => {
  const coupon = req.session.coupon || null;
  const { subtotal, shipping, discount, total } = calcTotals(req.session.cart, coupon);
  res.render('cart', {
    title: 'Cart - Fruitables',
    cart: req.session.cart,
    subtotal,
    shipping,
    discount,
    total,
    coupon,
    couponError: null,
  });
};

/** POST /cart/add/:productId - Add a product (or bump quantity) to the session cart */
const addToCart = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }

  const quantity = Math.max(1, parseInt(req.body.quantity, 10) || 1);
  const existing = req.session.cart.find((item) => item.productId === String(product._id));

  if (existing) {
    existing.quantity += quantity;
  } else {
    req.session.cart.push({
      productId: String(product._id),
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    });
  }

  res.redirect('/cart');
});

/** POST /cart/update/:productId - Set an exact quantity */
const updateCartItem = (req, res) => {
  const { productId } = req.params;
  const quantity = Math.max(1, parseInt(req.body.quantity, 10) || 1);
  const item = req.session.cart.find((i) => i.productId === productId);

  if (item) item.quantity = quantity;

  res.redirect('/cart');
};

/** POST /cart/remove/:productId - Remove item from cart */
const removeFromCart = (req, res) => {
  req.session.cart = req.session.cart.filter((i) => i.productId !== req.params.productId);
  res.redirect('/cart');
};

/** POST /cart/apply-coupon - Validate a coupon code and store it in the session */
const applyCoupon = asyncHandler(async (req, res) => {
  const cart = req.session.cart || [];
  const code = (req.body.code || '').trim().toUpperCase();
  const { subtotal } = calcTotals(cart, null);

  const renderError = (message) => {
    const totals = calcTotals(cart, req.session.coupon || null);
    return res.status(400).render('cart', {
      title: 'Cart - Fruitables',
      cart,
      ...totals,
      coupon: req.session.coupon || null,
      couponError: message,
    });
  };

  if (!code) {
    return renderError('Please enter a coupon code.');
  }
  if (cart.length === 0) {
    return renderError('Your cart is empty.');
  }

  const coupon = await Coupon.findOne({ code });

  if (!coupon || !coupon.isActive) {
    return renderError('This coupon code is invalid.');
  }
  if (coupon.expiryDate && coupon.expiryDate < new Date()) {
    return renderError('This coupon has expired.');
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return renderError('This coupon has reached its usage limit.');
  }
  if (coupon.minPurchase && subtotal < coupon.minPurchase) {
    return renderError(`This coupon needs a minimum order of Rs ${coupon.minPurchase}.`);
  }

  // Store only the fields checkout needs - never the full Mongoose doc - in the session.
  req.session.coupon = {
    couponId: String(coupon._id),
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    maxDiscount: coupon.maxDiscount || null,
    minPurchase: coupon.minPurchase || 0,
  };

  res.redirect('/cart');
});

/** POST /cart/remove-coupon - Drop any applied coupon from the session */
const removeCoupon = (req, res) => {
  req.session.coupon = null;
  res.redirect('/cart');
};

module.exports = {
  renderCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  applyCoupon,
  removeCoupon,
  calcTotals,
};
