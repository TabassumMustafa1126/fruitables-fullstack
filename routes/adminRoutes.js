const express = require('express');
const router = express.Router();
const {
  listProducts,
  renderNewForm,
  createProduct,
  renderEditForm,
  updateProduct,
  deleteProduct,
} = require('../controllers/adminController');

// method-override (already registered globally in app.js) lets forms send
// ?_method=PUT / ?_method=DELETE since plain HTML forms only support GET/POST.
router.get('/', listProducts);
router.get('/new', renderNewForm);
router.post('/', createProduct);
router.get('/:id/edit', renderEditForm);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
