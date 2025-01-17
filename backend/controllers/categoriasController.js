import Categoria from '../models/categoria.js';

// Endpoint para obtener los datos de toda Categoria
export const obtenerCategorias = async (req, res) => {
    const userId = req.user.id_usuario; // Confirmamos que el token exista en la request

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const categorias = await Categoria.obtenerTodas();
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
        const categoriasActivas = await Categoria.obtenerActivas();
        res.json(categoriasActivas);
    } catch (e) {
        res.status(404).send('Error al recuperar categorias activas: ' + e.message);
    }
};

// Endpoint para obtener los datos de solo una Categoria
export const obtenerCategoriaPorId = async (req, res) => {
    const id_categoria = req.params.id;
    const userId = req.user.id_usuario;

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const pool = await conectarDB();
        const categoria = await Categoria.obtenerPorId(id_categoria);
        res.json(categoria);
    } catch (e) {
        res.status(404).send('Error al recuperar la Categoria: ' + e.message);
    }
};

// Endpoint para insertarUsuario una Categoria
export const insertarCategoriaProducto = async (req, res) => {
    const { nombre, id_estado } = req.body;
    const userId = req.user.id_usuario;

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const id_categoria =  await Categoria.insertarCategoria({nombre, userId, id_estado});
        res.status(200).json({ id_categoria, message: 'Categoría de producto creada exitosamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al crear la categoría de producto', error: err.message });
    }
};

// Endpoint para actualizarUsuario una Categoria
export const editarCategoria = async (req, res) => {
    const id_categoria = req.params.id;
    const { nombre, id_estado } = req.body;
    const userId = req.user.id_usuario;

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        await Categoria.actualizarCategoria({nombre, id_estado, id_categoria});
        res.status(200).json('Categoría de producto editada exitosamente');
    } catch (err) {
        res.status(500).json({ message: 'Error al editar la categoría de producto', error: err.message });
    }
};

// Endpoint para inactivar una Categoria
export const desactivarCategoria = async (req, res) => {
    const id_categoria = req.params.id;
    const userId = req.user.id_usuario;

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        await Categoria.desactivarCategoria(id_categoria);
        res.status(200).send('Categoria desactivada con exito.');
    } catch (err) {
        res.status(500).send('Error al intentar desactivar la Categoria: ' + err.message);
    }
};
