import { conectarDB } from '../config/db.js';
import Categoria from '../models/categoria.js';

// Endpoint para obtener los datos de toda categoria
export const obtenerCategorias = async (req, res) => {
    const userId = req.user.id_usuario; // Confirmamos que el token exista en la request

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const pool = await conectarDB();
        const categorias = await Categoria.obtenerTodas(pool);
        res.json(categorias);
    } catch (e) {
        res.status(404).send('Error al recuperar todas las categorias: ' + e.message);
    }
};

// Endpoint para obtener los datos de cada categorias activo
export const obtenerCategoriasActivas = async (req, res) => {
    const userId = req.user.id_usuario; // Confirmamos que el token exista en la request

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const pool = await conectarDB();
        const categoriasActivas = await Categoria.obtenerActivas(pool);
        res.json(categoriasActivas);
    } catch (e) {
        res.status(404).send('Error al recuperar categorias activas: ' + e.message);
    }
};

// Endpoint para obtener los datos de solo una categoria
export const obtenerCategoriaPorId = async (req, res) => {
    const id_categoria = req.params.id;
    const userId = req.user.id_usuario;

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const pool = await conectarDB();
        const categoria = await Categoria.obtenerPorId(pool, id_categoria);
        res.json(categoria);
    } catch (e) {
        res.status(404).send('Error al recuperar la categoria: ' + e.message);
    }
};

// Endpoint para insertarUsuario una categoria
export const insertarCategoriaProducto = async (req, res) => {
    const { nombre, id_estado } = req.body;
    const userId = req.user.id_usuario;

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const pool = await conectarDB();
        const categoria = new Categoria(null, nombre, id_estado, null);
        const id_categoria = await categoria.insertarCategoria(pool, userId);
        res.status(201).json({ id_categoria, message: 'Categoría de producto creada exitosamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al crear la categoría de producto', error: err.message });
    }
};

// Endpoint para actualizarUsuario una categoria
export const editarCategoria = async (req, res) => {
    const id_categoria = req.params.id;
    const { nombre, id_estado, fecha_creacion } = req.body;
    const userId = req.user.id_usuario;

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const pool = await conectarDB();
        const categoria = new Categoria(id_categoria, nombre, id_estado, fecha_creacion);
        await categoria.actualizarCategoria(pool);
        res.status(201).json('Categoría de producto editada exitosamente');
    } catch (err) {
        res.status(500).json({ message: 'Error al editar la categoría de producto', error: err.message });
    }
};

// Endpoint para inactivar una categoria
export const desactivarCategoria = async (req, res) => {
    const id_categoria = req.params.id;
    const userId = req.user.id_usuario;

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const pool = await conectarDB();
        await Categoria.desactivarCategoria(pool, id_categoria);
        res.status(201).send('Categoria desactivada con exito.');
    } catch (err) {
        res.status(500).send('Error al intentar desactivarCategoria la categoria: ' + err.message);
    }
};
