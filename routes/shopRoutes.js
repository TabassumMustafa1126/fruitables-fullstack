const express = require('express');
const router = express.Router();
const { renderShop, renderShopDetail, addReview } = require('../controllers/shopController');

router.get('/', renderShop);
router.get('/:id', renderShopDetail);
router.post('/:id/reviews', addReview);

module.exports = router;
