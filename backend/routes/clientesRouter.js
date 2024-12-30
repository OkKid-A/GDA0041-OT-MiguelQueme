import express from 'express';
import {
    obtenerClientes,
    obtenerClientePorID,
    crearCliente,
    editarCliente,
    desactivarCliente
} from '../controllers/clientesController.js';
import autenticacionToken from '../middleware/autenticacionToken.js';
import verificarRol from '../middleware/verificarRol.js';
const router = express.Router();

router.get('/', autenticacionToken, verificarRol(Roles.OPERADOR), obtenerClientes);
router.get('/:id', autenticacionToken, verificarRol(Roles.OPERADOR), obtenerClientePorID);
router.post('/', autenticacionToken, verificarRol(Roles.OPERADOR), crearCliente);
router.put('/:id', autenticacionToken, verificarRol(Roles.OPERADOR), editarCliente);
router.delete('/:id', autenticacionToken, verificarRol(Roles.OPERADOR), desactivarCliente);

export default router;
