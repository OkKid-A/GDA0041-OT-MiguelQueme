import express from 'express';
import {
    obtenerProductos,
    obtenerProductoPorId,
    insertarProducto,
    editarProducto,
    desactivarProducto
} from '../controllers/productosController.js';
import autenticacionToken from '../middleware/autenticacionToken.js';
import verificarRol from "../middleware/verificarRol.js";
import Roles from "../utils/Roles.js"

const router = express.Router();

router.get('/', autenticacionToken, verificarRol(Roles.OPERADOR, Roles.USUARIO),obtenerProductos);
router.get('/:id', autenticacionToken, verificarRol(Roles.OPERADOR, Roles.USUARIO),obtenerProductoPorId);
router.post('/', autenticacionToken, verificarRol(Roles.OPERADOR),insertarProducto);
router.put('/:id', autenticacionToken, verificarRol(Roles.OPERADOR), editarProducto);
router.delete('/:id', autenticacionToken, verificarRol(Roles.OPERADOR), desactivarProducto);

export default router;
