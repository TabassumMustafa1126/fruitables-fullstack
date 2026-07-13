const BlogPost = require('../models/BlogPost');
const { asyncHandler } = require('../middlewares/errorHandler');

/** GET /blog - list all posts, newest first */
const listPosts = asyncHandler(async (req, res) => {
  const posts = await BlogPost.find({}).sort({ createdAt: -1 });
  res.render('blog', {
    title: 'Blog - Fruitables',
    posts,
  });
});

/** GET /blog/:id - single post */
const showPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    const err = new Error('Blog post not found');
    err.statusCode = 404;
    throw err;
  }

  const recentPosts = await BlogPost.find({ _id: { $ne: post._id } }).sort({ createdAt: -1 }).limit(3);

  res.render('blog-detail', {
    title: `${post.title} - Fruitables`,
    post,
    recentPosts,
  });
});

module.exports = { listPosts, showPost };
