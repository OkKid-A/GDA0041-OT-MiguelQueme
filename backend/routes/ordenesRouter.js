import express from 'express';
import {
    obtenerOrdenes,
    obtenerOrdenPorID,
    insertarOrdenConDetalle,
    actualizarOrden,
    desactivarOrden
} from '../controllers/ordenesController.js';
import autenticacionToken from '../middleware/autenticacionToken.js';
import verificarRol from "../middleware/verificarRol.js";
import Roles from "../utils/Roles.js"

const router = express.Router();

router.get('/', autenticacionToken, verificarRol(Roles.OPERADOR),obtenerOrdenes);
router.get('/:id', autenticacionToken, verificarRol(Roles.OPERADOR, Roles.USUARIO),obtenerOrdenPorID);
router.post('/', autenticacionToken, verificarRol(Roles.OPERADOR),insertarOrdenConDetalle);
router.put('/:id', autenticacionToken, verificarRol(Roles.OPERADOR), actualizarOrden);
router.delete('/:id', autenticacionToken, verificarRol(Roles.OPERADOR), desactivarOrden);

export default router;
