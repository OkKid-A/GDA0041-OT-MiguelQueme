import Producto from '../models/producto.js';
import multer from "multer";
import path from "path";

// Obtiene los datos de cada producto activo
export const obtenerProductos = async (req, res) => {
    const id_usuario = req.user.id_usuario; // Confirmamos que el token exista en la request

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const productos = await Producto.obtenerActivos();
        res.status(200).json(productos);
    } catch (e) {
        res.status(404).send('Error al recuperar productos activos: ' + e.message);
    }
}

// Obtiene todos los productos sin condiciones
export const obtenerTodosProductos = async (req, res) => {
    const id_usuario = req.user.id_usuario; // Confirmamos que el token exista en la request

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const productos = await Producto.obtenerTodos();
        res.status(200).json(productos);
    } catch (e) {
        res.status(404).send('Error al recuperar productos: ' + e.message);
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
        const producto = await Producto.obtenerPorId(id_producto);
        res.json(producto);
    } catch (e) {
        res.status(404).send('Error al recuperar el producto: ' + e.message);
    }
}

// Inserta un nuevo producto
export const insertarProducto = async (req, res) => {
    const { nombre, marca, codigo, stock, precio, id_categoria, id_estado } = req.body;
    const id_usuario = req.user.id_usuario; // Confirmamos que el token exista en la request

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }
    let foto;
    if (req.file){
        foto = `http://localhost:3000/productos/storage/${req.file.filename}`;
    } else {
        foto = null;
    }

    try {
        const id_producto = await Producto.insertarProducto({nombre, marca, codigo, stock, precio, foto, id_categoria, id_usuario, id_estado});
        res.status(200).send({ id_producto, message: 'Producto creado exitosamente' });
    } catch (err) {
        res.status(500).send('Error al insertar el producto: ' + err.message);
    }
}

// Constante para especificar donde se guardaran las imagenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `storage/`);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix+path.extname(file.originalname));
    }
})
const upload = multer({ storage: storage })
export const uploadImage = upload.single('foto');

// Actualiza un producto, podemos cambiar uno, varios o todos los campos
export const editarProducto = async (req, res) => {
    const id_usuario = req.user.id_usuario;

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    const id_producto = req.params.id;
    const { nombre, marca, codigo, stock, precio, id_categoria, id_estado } = req.body;
    let foto;
    if (req.file){
        foto = `http://localhost:3000/productos/storage/${req.file.filename}`;
    } else {
        foto = null;
    }
    console.log(foto);

    try {
        await Producto.actualizarProducto({id_producto, nombre, marca, codigo, stock, precio, foto, id_categoria, id_estado });
        res.status(200).send('Producto actualizado con exito.');
    } catch (err) {
        res.status(500).send('Error al intentar actualizar el producto: ' + err.message);
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
        await Producto.desactivarProducto(id_producto);
        res.status(200).send('Producto desactivado con exito.');
    } catch (err) {
        res.status(500).send('Error al intentar desactivar el producto: ' + err.message);
    }
};
