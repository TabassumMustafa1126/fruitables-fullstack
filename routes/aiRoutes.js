const express = require('express');
const router = express.Router();
const { getHistory, askAssistant } = require('../controllers/aiController');

// Both consumed via fetch() by the floating chat widget - see views/partials/ai-widget.ejs
router.get('/history', getHistory);
router.post('/ask', askAssistant);

module.exports = router;
