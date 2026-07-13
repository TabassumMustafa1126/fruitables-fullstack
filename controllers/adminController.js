const Product = require('../models/Product');
const { asyncHandler } = require('../middlewares/errorHandler');

/** GET /admin/products - list every product with edit/delete controls */
const listProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 });
  res.render('admin/products', {
    title: 'Manage Products - Admin',
    products,
  });
});

/** GET /admin/products/new - blank form to create a product */
const renderNewForm = (req, res) => {
  res.render('admin/product-form', {
    title: 'Add Product - Admin',
    product: null,
    errors: [],
  });
};

/** POST /admin/products - create a product */
const createProduct = asyncHandler(async (req, res) => {
  const { name, category, price, oldPrice, unit, image, rating, description, stock } = req.body;

  try {
    await Product.create({
      name,
      category,
      price,
      oldPrice: oldPrice || undefined,
      unit,
      image,
      rating,
      description,
      stock,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).render('admin/product-form', {
        title: 'Add Product - Admin',
        product: req.body,
        errors,
      });
    }
    throw err;
  }

  res.redirect('/admin/products');
});

/** GET /admin/products/:id/edit - pre-filled form */
const renderEditForm = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }

  res.render('admin/product-form', {
    title: 'Edit Product - Admin',
    product,
    errors: [],
  });
});

/** PUT /admin/products/:id - update a product */
const updateProduct = asyncHandler(async (req, res) => {
  const { name, category, price, oldPrice, unit, image, rating, description, stock } = req.body;

  let product;
  try {
    product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category, price, oldPrice: oldPrice || undefined, unit, image, rating, description, stock },
      { new: true, runValidators: true }
    );
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).render('admin/product-form', {
        title: 'Edit Product - Admin',
        product: { ...req.body, _id: req.params.id },
        errors,
      });
    }
    throw err;
  }

  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }

  res.redirect('/admin/products');
});

/** DELETE /admin/products/:id - remove a product */
const deleteProduct = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/admin/products');
});

module.exports = {
  listProducts,
  renderNewForm,
  createProduct,
  renderEditForm,
  updateProduct,
  deleteProduct,
};
