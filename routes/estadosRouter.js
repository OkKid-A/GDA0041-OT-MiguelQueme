const express = require('express');
const router = express.Router();
const estadosController = require('../controllers/estadosController');
const autenticacionToken = require("../middleware/autenticacionToken");

router.get('/', autenticacionToken, estadosController.obtenerEstados);
router.post('/', autenticacionToken, estadosController.insertarEstado);
router.put('/',autenticacionToken, estadosController.editarEstado);

module.exports = router;