const User = require('../models/User');

/**
 * Runs on every request: if the session has a logged-in user, load it and
 * expose it as res.locals.currentUser so any view (e.g. the navbar) can
 * show "Hi, Name" / Logout instead of Login / Register.
 */
async function attachUser(req, res, next) {
  res.locals.currentUser = null;

  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId).select('-password');
      res.locals.currentUser = user || null;
    } catch (err) {
      res.locals.currentUser = null;
    }
  }

  next();
}

/** Blocks access unless someone is logged in. */
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

/** Blocks access unless the logged-in user has the 'admin' role. */
function requireAdmin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  if (req.session.userRole !== 'admin') {
    const err = new Error('You must be an admin to access this page.');
    err.statusCode = 403;
    return next(err);
  }
  next();
}

module.exports = { attachUser, requireAuth, requireAdmin };
