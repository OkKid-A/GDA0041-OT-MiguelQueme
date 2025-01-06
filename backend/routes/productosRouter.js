import express from 'express';
import {
    obtenerProductos,
    obtenerProductoPorId,
    insertarProducto,
    editarProducto,
    desactivarProducto, obtenerTodosProductos, uploadImage
} from '../controllers/productosController.js';
import autenticacionToken from '../middleware/autenticacionToken.js';
import verificarRol from "../middleware/verificarRol.js";
import Roles from "../utils/Roles.js"
import path from "path";

const router = express.Router();

router.get('/', autenticacionToken, verificarRol(Roles.OPERADOR, Roles.USUARIO),obtenerProductos);
router.get('/todos', autenticacionToken, verificarRol(Roles.OPERADOR), obtenerTodosProductos);
router.get('/:id', autenticacionToken, verificarRol(Roles.OPERADOR, Roles.USUARIO),obtenerProductoPorId);
router.post('/', autenticacionToken, verificarRol(Roles.OPERADOR), uploadImage,insertarProducto);
router.put('/:id', autenticacionToken, verificarRol(Roles.OPERADOR), uploadImage, editarProducto);
router.delete('/:id', autenticacionToken, verificarRol(Roles.OPERADOR), desactivarProducto);
router.use('/storage', autenticacionToken, verificarRol(Roles.OPERADOR, Roles.USUARIO), express.static(path.join(process.cwd(), 'storage')));

export default router;
