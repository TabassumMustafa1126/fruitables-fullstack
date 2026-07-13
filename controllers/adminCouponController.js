const Coupon = require('../models/Coupon');
const { asyncHandler } = require('../middlewares/errorHandler');

/** GET /admin/coupons - list every coupon with edit/delete controls */
const listCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  res.render('admin/coupons', {
    title: 'Manage Coupons - Admin',
    coupons,
  });
});

/** GET /admin/coupons/new - blank form to create a coupon */
const renderNewForm = (req, res) => {
  res.render('admin/coupon-form', {
    title: 'Add Coupon - Admin',
    coupon: null,
    errors: [],
  });
};

/** POST /admin/coupons - create a coupon */
const createCoupon = asyncHandler(async (req, res) => {
  const { code, discountType, discountValue, maxDiscount, minPurchase, expiryDate, usageLimit, isActive } =
    req.body;

  try {
    await Coupon.create({
      code,
      discountType,
      discountValue,
      maxDiscount: maxDiscount || undefined,
      minPurchase: minPurchase || 0,
      expiryDate: expiryDate || undefined,
      usageLimit: usageLimit || undefined,
      isActive: isActive === 'on' || isActive === 'true',
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).render('admin/coupon-form', {
        title: 'Add Coupon - Admin',
        coupon: req.body,
        errors,
      });
    }
    if (err.code === 11000) {
      return res.status(400).render('admin/coupon-form', {
        title: 'Add Coupon - Admin',
        coupon: req.body,
        errors: ['A coupon with this code already exists.'],
      });
    }
    throw err;
  }

  res.redirect('/admin/coupons');
});

/** GET /admin/coupons/:id/edit - pre-filled form */
const renderEditForm = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    const err = new Error('Coupon not found');
    err.statusCode = 404;
    throw err;
  }

  res.render('admin/coupon-form', {
    title: 'Edit Coupon - Admin',
    coupon,
    errors: [],
  });
});

/** PUT /admin/coupons/:id - update a coupon */
const updateCoupon = asyncHandler(async (req, res) => {
  const { code, discountType, discountValue, maxDiscount, minPurchase, expiryDate, usageLimit, isActive } =
    req.body;

  let coupon;
  try {
    coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      {
        code,
        discountType,
        discountValue,
        maxDiscount: maxDiscount || undefined,
        minPurchase: minPurchase || 0,
        expiryDate: expiryDate || undefined,
        usageLimit: usageLimit || undefined,
        isActive: isActive === 'on' || isActive === 'true',
      },
      { new: true, runValidators: true }
    );
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).render('admin/coupon-form', {
        title: 'Edit Coupon - Admin',
        coupon: { ...req.body, _id: req.params.id },
        errors,
      });
    }
    if (err.code === 11000) {
      return res.status(400).render('admin/coupon-form', {
        title: 'Edit Coupon - Admin',
        coupon: { ...req.body, _id: req.params.id },
        errors: ['A coupon with this code already exists.'],
      });
    }
    throw err;
  }

  if (!coupon) {
    const err = new Error('Coupon not found');
    err.statusCode = 404;
    throw err;
  }

  res.redirect('/admin/coupons');
});

/** DELETE /admin/coupons/:id - remove a coupon */
const deleteCoupon = asyncHandler(async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.redirect('/admin/coupons');
});

module.exports = {
  listCoupons,
  renderNewForm,
  createCoupon,
  renderEditForm,
  updateCoupon,
  deleteCoupon,
};
