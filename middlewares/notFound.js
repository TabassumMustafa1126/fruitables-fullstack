/**
 * Fires when no route matched the request. Renders the template's own 404 page.
 */
function notFound(req, res, next) {
  res.status(404);
  res.render('404', {
    title: '404 Not Found',
  });
}

module.exports = notFound;
