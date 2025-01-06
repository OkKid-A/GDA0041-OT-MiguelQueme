import express from 'express';
import {
    obtenerCategorias,
    obtenerCategoriasActivas,
    obtenerCategoriaPorId,
    insertarCategoriaProducto,
    editarCategoria,
    desactivarCategoria
} from '../controllers/categoriasController.js';
import autenticacionToken from '../middleware/autenticacionToken.js';
import verificarRol from "../middleware/verificarRol.js";
import Roles from "../utils/Roles.js"

const router = express.Router();

router.get('/', autenticacionToken, verificarRol(Roles.OPERADOR),obtenerCategorias);
router.get('/activas', autenticacionToken, verificarRol(Roles.USUARIO, Roles.OPERADOR),obtenerCategoriasActivas);
router.get('/:id', autenticacionToken, verificarRol(Roles.OPERADOR),obtenerCategoriaPorId);
router.post('/', autenticacionToken, verificarRol(Roles.OPERADOR), insertarCategoriaProducto);
router.put('/:id', autenticacionToken, verificarRol(Roles.OPERADOR),editarCategoria);
router.delete('/:id', autenticacionToken, verificarRol(Roles.OPERADOR),desactivarCategoria);

export default router;
