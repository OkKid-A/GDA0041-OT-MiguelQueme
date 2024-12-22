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

const router = express.Router();

router.get('/', autenticacionToken, obtenerCategorias);
router.get('/activas', autenticacionToken, obtenerCategoriasActivas);
router.get('/:id', autenticacionToken, obtenerCategoriaPorId);
router.post('/', autenticacionToken, insertarCategoriaProducto);
router.put('/:id', autenticacionToken, editarCategoria);
router.delete('/:id', autenticacionToken, desactivarCategoria);

export default router;
