const BlogPost = require('../models/BlogPost');
const { asyncHandler } = require('../middlewares/errorHandler');

/** GET /admin/blog - list every post with edit/delete controls */
const listPosts = asyncHandler(async (req, res) => {
  const posts = await BlogPost.find({}).sort({ createdAt: -1 });
  res.render('admin/blog', {
    title: 'Manage Blog - Admin',
    posts,
  });
});

/** GET /admin/blog/new - blank form to create a post */
const renderNewForm = (req, res) => {
  res.render('admin/blog-form', {
    title: 'Add Blog Post - Admin',
    post: null,
    errors: [],
  });
};

/** POST /admin/blog - create a post */
const createPost = asyncHandler(async (req, res) => {
  const { title, image, excerpt, content, author } = req.body;

  try {
    await BlogPost.create({ title, image, excerpt, content, author });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).render('admin/blog-form', {
        title: 'Add Blog Post - Admin',
        post: req.body,
        errors,
      });
    }
    throw err;
  }

  res.redirect('/admin/blog');
});

/** GET /admin/blog/:id/edit - pre-filled form */
const renderEditForm = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    const err = new Error('Blog post not found');
    err.statusCode = 404;
    throw err;
  }

  res.render('admin/blog-form', {
    title: 'Edit Blog Post - Admin',
    post,
    errors: [],
  });
});

/** PUT /admin/blog/:id - update a post */
const updatePost = asyncHandler(async (req, res) => {
  const { title, image, excerpt, content, author } = req.body;

  let post;
  try {
    post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { title, image, excerpt, content, author },
      { new: true, runValidators: true }
    );
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).render('admin/blog-form', {
        title: 'Edit Blog Post - Admin',
        post: { ...req.body, _id: req.params.id },
        errors,
      });
    }
    throw err;
  }

  if (!post) {
    const err = new Error('Blog post not found');
    err.statusCode = 404;
    throw err;
  }

  res.redirect('/admin/blog');
});

/** DELETE /admin/blog/:id - remove a post */
const deletePost = asyncHandler(async (req, res) => {
  await BlogPost.findByIdAndDelete(req.params.id);
  res.redirect('/admin/blog');
});

module.exports = { listPosts, renderNewForm, createPost, renderEditForm, updatePost, deletePost };
