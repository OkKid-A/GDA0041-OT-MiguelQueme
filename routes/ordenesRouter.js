import express from 'express';
import {
    obtenerOrdenes,
    obtenerOrdenPorID,
    insertarOrdenConDetalle,
    actualizarOrden,
    desactivarOrden
} from '../controllers/ordenesController.js';
import autenticacionToken from '../middleware/autenticacionToken.js';
import verificadorOperador from '../middleware/verificadorOperador.js';

const router = express.Router();

router.get('/', autenticacionToken, obtenerOrdenes);
router.get('/:id', autenticacionToken, obtenerOrdenPorID);
router.post('/', autenticacionToken, insertarOrdenConDetalle);
router.put('/:id', autenticacionToken, verificadorOperador, actualizarOrden);
router.delete('/', autenticacionToken, verificadorOperador, desactivarOrden);

export default router;
