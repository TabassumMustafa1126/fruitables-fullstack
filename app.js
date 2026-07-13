const path = require('path');
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');

const attachCart = require('./middlewares/cart');
const { attachUser } = require('./middlewares/auth');
const notFound = require('./middlewares/notFound');
const { errorHandler } = require('./middlewares/errorHandler');

const indexRoutes = require('./routes/indexRoutes');
const authRoutes = require('./routes/authRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const shopRoutes = require('./routes/shopRoutes');
const cartRoutes = require('./routes/cartRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const contactRoutes = require('./routes/contactRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const blogRoutes = require('./routes/blogRoutes');
const aiRoutes = require('./routes/aiRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminBlogRoutes = require('./routes/adminBlogRoutes');
const adminCouponRoutes = require('./routes/adminCouponRoutes');

const app = express();

// --- View engine (EJS + shared layout) ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'partials/layout');

// --- Core middleware ---
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback_dev_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

app.use(attachCart);
app.use(attachUser);

// --- Routes (MVC: routes delegate to controllers, controllers use models) ---
app.use('/', indexRoutes);
app.use('/', authRoutes); // /login, /register, /logout
app.use('/about', aboutRoutes);
app.use('/shop', shopRoutes);
app.use('/cart', cartRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/contact', contactRoutes);
app.use('/testimonial', testimonialRoutes);
app.use('/blog', blogRoutes);
app.use('/ai', aiRoutes);
app.use('/admin/products', adminRoutes);
app.use('/admin/blog', adminBlogRoutes);
app.use('/admin/coupons', adminCouponRoutes);

// --- 404 + centralized error handling (must be registered last) ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;
