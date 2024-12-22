import express from 'express';
import {
    obtenerClientes,
    obtenerClientePorID,
    crearCliente,
    editarCliente
} from '../controllers/clientesController.js';
import autenticacionToken from '../middleware/autenticacionToken.js';
import verificadorOperador from '../middleware/verificadorOperador.js';

const router = express.Router();

router.get('/', autenticacionToken, verificadorOperador, obtenerClientes);
router.get('/:id', autenticacionToken, verificadorOperador, obtenerClientePorID);
router.post('/', autenticacionToken, verificadorOperador, crearCliente);
router.put('/:id', autenticacionToken, verificadorOperador, editarCliente);

export default router;
