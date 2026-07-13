/**
 * Central error handling middleware.
 * Any controller that calls next(err) (or throws inside an async wrapper)
 * ends up here instead of crashing the process.
 */
function errorHandler(err, req, res, next) {
  console.error(`[error] ${req.method} ${req.originalUrl} ->`, err.message);

  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;

  // Mongoose validation errors -> collect friendly messages
  let message = err.message || 'Something went wrong on the server.';
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }
  if (err.name === 'CastError') {
    message = `Invalid value for "${err.path}".`;
  }

  res.status(statusCode);
  res.render('error', {
    title: 'Something went wrong',
    message,
    statusCode,
    showStack: process.env.NODE_ENV === 'development',
    stack: err.stack,
  });
}

/**
 * Wraps an async controller function so any rejected promise / thrown error
 * is automatically forwarded to next(err) instead of needing try/catch everywhere.
 */
function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = { errorHandler, asyncHandler };
