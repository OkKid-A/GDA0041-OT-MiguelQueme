import express from 'express';
import {
    obtenerEstados,
    insertarEstado,
    editarEstado
} from '../controllers/estadosController.js';
import autenticacionToken from '../middleware/autenticacionToken.js';

const router = express.Router();

router.get('/', autenticacionToken, obtenerEstados);
router.post('/', autenticacionToken, insertarEstado);
router.put('/:id', autenticacionToken, editarEstado);

export default router;
