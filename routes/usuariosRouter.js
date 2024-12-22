import express from 'express';
import {
    obtenerUsuarios,
    insertarUsuario,
    editarUsuario,
    desactivarUsuario
} from '../controllers/usuariosController.js';
import autenticacionToken from '../middleware/autenticacionToken.js';
import verificadorOperador from '../middleware/verificadorOperador.js';

const router = express.Router();

router.get('/', autenticacionToken, verificadorOperador, obtenerUsuarios);
router.post('/', autenticacionToken, verificadorOperador, insertarUsuario);
router.put('/:id', autenticacionToken, verificadorOperador, editarUsuario);
router.delete('/:id', autenticacionToken, verificadorOperador, desactivarUsuario);

export default router;
