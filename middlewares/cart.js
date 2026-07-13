/**
 * Ensures every request has a cart array available at req.session.cart.
 * The cart is a simple array of { productId, name, price, image, quantity }.
 * Also exposes a cartCount on res.locals so any view (e.g. the navbar) can show it.
 */
function attachCart(req, res, next) {
  if (!req.session.cart) {
    req.session.cart = [];
  }

  res.locals.cartCount = req.session.cart.reduce((sum, item) => sum + item.quantity, 0);
  next();
}

module.exports = attachCart;
