const express = require('express');
const router = express.Router();
const {
  listPosts,
  renderNewForm,
  createPost,
  renderEditForm,
  updatePost,
  deletePost,
} = require('../controllers/adminBlogController');

router.get('/', listPosts);
router.get('/new', renderNewForm);
router.post('/', createPost);
router.get('/:id/edit', renderEditForm);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;
