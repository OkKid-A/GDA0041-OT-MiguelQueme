import express from 'express';
import {
    obtenerProductos,
    obtenerProductoPorId,
    insertarProducto,
    editarProducto,
    desactivarProducto
} from '../controllers/productosController.js';
import autenticacionToken from '../middleware/autenticacionToken.js';

const router = express.Router();

router.get('/', autenticacionToken, obtenerProductos);
router.get('/:id', autenticacionToken, obtenerProductoPorId);
router.post('/', autenticacionToken, insertarProducto);
router.put('/:id', autenticacionToken, editarProducto);
router.delete('/:id', autenticacionToken, desactivarProducto);

export default router;
