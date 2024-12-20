const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const autenticacionToken = require("../middleware/autenticacionToken");
const verificadorOperador = require("../middleware/verificadorOperador");

router.get('/',autenticacionToken, verificadorOperador, usuariosController.obtenerUsuarios);
router.post('/',autenticacionToken, verificadorOperador, usuariosController.insertarUsuario);
router.put('/:id',autenticacionToken, verificadorOperador, usuariosController.editarUsuario);
router.delete('/:id',autenticacionToken, verificadorOperador, usuariosController.desactivarUsuario)

module.exports = router;