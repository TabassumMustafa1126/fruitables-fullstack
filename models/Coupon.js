const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      trim: true,
      uppercase: true,
      unique: true,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
    },
    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: [0, 'Discount value cannot be negative'],
    },
    // Only used when discountType is 'percentage' - caps the rupee amount discounted.
    maxDiscount: {
      type: Number,
      min: 0,
    },
    // Cart subtotal must be at least this much for the coupon to apply.
    minPurchase: {
      type: Number,
      default: 0,
      min: 0,
    },
    expiryDate: {
      type: Date,
    },
    // How many times this coupon can be redeemed in total. Leave empty for unlimited.
    usageLimit: {
      type: Number,
      min: 0,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);
