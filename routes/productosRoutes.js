const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const autenticacionToken = require("../middleware/autenticacionToken");

router.get('/',autenticacionToken,productosController.obtenerProductos);
router.get('/:id',autenticacionToken,productosController.obtenerProductoPorId);
router.post('/', autenticacionToken, productosController.insertarProducto);
router.put('/:id',autenticacionToken, productosController.editarProducto);
router.delete('/:id',autenticacionToken, productosController.desactivarProducto);


module.exports = router;