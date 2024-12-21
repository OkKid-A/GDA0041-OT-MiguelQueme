const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');
const autenticacionToken = require("../middleware/autenticacionToken");
const verificadorOperador = require("../middleware/verificadorOperador");

router.get('/',autenticacionToken,verificadorOperador,clientesController.obtenerClientes);
router.get('/:id',autenticacionToken,verificadorOperador,clientesController.obtenerClientePorID);
router.post('/',autenticacionToken,verificadorOperador,clientesController.crearCliente);
router.put('/:id',autenticacionToken,verificadorOperador,clientesController.crearCliente);

module.exports = router;