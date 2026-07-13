const express = require('express');
const router = express.Router();
const { renderHome } = require('../controllers/homeController');

router.get('/', renderHome);

module.exports = router;
