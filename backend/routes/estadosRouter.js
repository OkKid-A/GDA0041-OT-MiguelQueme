import express from 'express';
import {
    obtenerEstados,
    insertarEstado,
    editarEstado
} from '../controllers/estadosController.js';
import autenticacionToken from '../middleware/autenticacionToken.js';
import verificarRol from "../middleware/verificarRol.js";
import Roles from "../utils/Roles.js"

const router = express.Router();

router.get('/', autenticacionToken, verificarRol(Roles.OPERADOR),obtenerEstados);
router.post('/', autenticacionToken, verificarRol(Roles.OPERADOR),insertarEstado);
router.put('/:id', autenticacionToken, verificarRol(Roles.OPERADOR),editarEstado);

export default router;
