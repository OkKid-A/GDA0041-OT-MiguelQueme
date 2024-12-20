const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const autenticacionToken = require("../middleware/autenticacionToken");

router.post('/login',authController.login);
router.post('/logout',autenticacionToken,authController.logout);

module.exports = router;