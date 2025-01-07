import express from 'express';
import {
    obtenerUsuarios,
    insertarUsuario,
    editarUsuario,
    desactivarUsuario, verificarUnico
} from '../controllers/usuariosController.js';
import autenticacionToken from '../middleware/autenticacionToken.js';
import verificarRol from "../middleware/verificarRol.js";
import Roles from "../utils/Roles.js"

const router = express.Router();

router.get('/', autenticacionToken, verificarRol(Roles.OPERADOR), obtenerUsuarios);
router.get('/unique/:correo',autenticacionToken, verificarRol(Roles.OPERADOR), verificarUnico);
router.post('/', autenticacionToken, verificarRol(Roles.OPERADOR), insertarUsuario);
router.put('/:id', autenticacionToken, verificarRol(Roles.OPERADOR), editarUsuario);
router.delete('/:id', autenticacionToken, verificarRol(Roles.OPERADOR), desactivarUsuario);
router.get('/')

export default router;
