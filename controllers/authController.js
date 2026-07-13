const User = require('../models/User');
const { asyncHandler } = require('../middlewares/errorHandler');

/** GET /register */
const renderRegister = (req, res) => {
  res.render('auth/register', {
    title: 'Register - Fruitables',
    errors: [],
    formData: {},
  });
};

/** POST /register - create the account, then log the user straight in */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  const errors = [];
  if (password !== confirmPassword) {
    errors.push('Passwords do not match.');
  }

  const existing = await User.findOne({ email: (email || '').toLowerCase() });
  if (existing) {
    errors.push('An account with that email already exists.');
  }

  if (errors.length > 0) {
    return res.status(400).render('auth/register', {
      title: 'Register - Fruitables',
      errors,
      formData: { name, email },
    });
  }

  let user;
  try {
    user = await User.create({ name, email, password });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).render('auth/register', {
        title: 'Register - Fruitables',
        errors: validationErrors,
        formData: { name, email },
      });
    }
    throw err;
  }

  req.session.userId = user._id.toString();
  req.session.userRole = user.role;
  res.redirect('/');
});

/** GET /login */
const renderLogin = (req, res) => {
  res.render('auth/login', {
    title: 'Login - Fruitables',
    error: null,
    formData: {},
  });
};

/** POST /login */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: (email || '').toLowerCase() });
  const passwordMatches = user ? await user.comparePassword(password || '') : false;

  if (!user || !passwordMatches) {
    return res.status(401).render('auth/login', {
      title: 'Login - Fruitables',
      error: 'Invalid email or password.',
      formData: { email },
    });
  }

  req.session.userId = user._id.toString();
  req.session.userRole = user.role;
  res.redirect('/');
});

/** POST /logout */
const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

module.exports = { renderRegister, register, renderLogin, login, logout };
