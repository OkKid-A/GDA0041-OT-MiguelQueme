import { conectarDB } from '../config/db.js';
import Producto from '../models/producto.js';

// Obtiene los datos de cada producto activo
export const obtenerProductos = async (req, res) => {
    const id_usuario = req.user.id_usuario; // Confirmamos que el token exista en la request

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const pool = await conectarDB();
        const productos = await Producto.obtenerActivos(pool);
        res.json(productos);
    } catch (e) {
        res.status(404).send('Error al recuperar productos activos: ' + e.message);
    }
}

// Obtiene un solo producto segun su id
export const obtenerProductoPorId = async (req, res) => {
    const id_producto = req.params.id;
    const id_usuario = req.user.id_usuario; // Confirmamos que el token exista en la request

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const pool = await conectarDB();
        const producto = await Producto.obtenerPorId(pool, id_producto);
        res.json(producto);
    } catch (e) {
        res.status(404).send('Error al recuperar el producto: ' + e.message);
    }
}

// Inserta un nuevo producto
export const insertarProducto = async (req, res) => {
    const { nombre, marca, codigo, stock, precio, foto, id_categoria, id_estado } = req.body;
    const id_usuario = req.user.id_usuario; // Confirmamos que el token exista en la request

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const pool = await conectarDB();
        const producto = new Producto(null, nombre, marca, codigo, stock, precio, foto, id_categoria, id_estado);
        const id_producto = await producto.insertarProducto(pool, id_usuario);
        res.status(201).send({ id_producto, message: 'Producto creado exitosamente' });
    } catch (err) {
        res.status(500).send('Error al insertarUsuario el producto: ' + err.message);
    }
}

// Actualiza un producto, podemos cambiar uno, varios o todos los campos
export const editarProducto = async (req, res) => {
    const id_producto = req.params.id;
    const { nombre, marca, codigo, stock, precio, fecha_creacion, foto, id_categoria, id_estado } = req.body;
    const id_usuario = req.user.id_usuario;

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const pool = await conectarDB();
        const producto = new Producto(id_producto, nombre, marca, codigo, stock, precio, foto, id_categoria, id_estado, fecha_creacion);
        await producto.actualizarProducto(pool);
        res.status(201).send('Producto actualizado con exito.');
    } catch (err) {
        res.status(500).send('Error al intentar actualizarUsuario el producto: ' + err.message);
    }
};

// Desactiva un producto
export const desactivarProducto = async (req, res) => {
    const id_producto = req.params.id;
    const userId = req.user.id_usuario;

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const pool = await conectarDB();
        await Producto.desactivar(pool, id_producto);
        res.status(201).send('Producto desactivado con exito.');
    } catch (err) {
        res.status(500).send('Error al intentar desactivarCategoria el producto: ' + err.message);
    }
};
