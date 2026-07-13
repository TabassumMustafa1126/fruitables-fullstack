const express = require('express');
const router = express.Router();
const { renderAbout } = require('../controllers/aboutController');

router.get('/', renderAbout);

module.exports = router;
