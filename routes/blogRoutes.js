const express = require('express');
const router = express.Router();
const { listPosts, showPost } = require('../controllers/blogController');

router.get('/', listPosts);
router.get('/:id', showPost);

module.exports = router;
