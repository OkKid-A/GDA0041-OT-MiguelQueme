const express = require('express');
const router = express.Router();
const ordenController = require('../controllers/ordenesController');
const autenticacionToken = require("../middleware/autenticacionToken");

router.post('/',autenticacionToken,ordenController.insertarOrdenConDetalle);
router.put('/:id',autenticacionToken, ordenController.actualizarOrden);

module.exports = router;
