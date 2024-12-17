const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasController');
const autenticacionToken = require("../middleware/autenticacionToken");

router.get('/',autenticacionToken, categoriasController.obtenerCategorias)
router.get('/activas',autenticacionToken, categoriasController.obtenerCategoriasActivas);
router.get('/:id',autenticacionToken, categoriasController.obtenerCategoriaPorId);
router.post('/',autenticacionToken, categoriasController.insertarCategoriaProducto);
router.put('/:id',autenticacionToken, categoriasController.editarCategoria);
router.delete('/:id',autenticacionToken, categoriasController.desactivarCategoria);

module.exports = router;