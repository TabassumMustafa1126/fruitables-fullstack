const express = require('express');
const router = express.Router();
const { renderRegister, register, renderLogin, login, logout } = require('../controllers/authController');

router.get('/register', renderRegister);
router.post('/register', register);
router.get('/login', renderLogin);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
