const express = require('express');
const router = express.Router();
const { renderContact, submitContact } = require('../controllers/contactController');

router.get('/', renderContact);
router.post('/', submitContact);

module.exports = router;
