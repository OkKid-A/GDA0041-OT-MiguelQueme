const {sql, conectarDB}= require('../config/db');
const Cliente = require('../models/cliente');

exports.obtenerClientes = async (req, res) => {
    const id_usuario = req.user.id_usuario; // Si la informacion del usuario existe la sesion es activa

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const pool = await conectarDB();

        const resultado = await pool.request()
            .query("SELECT * FROM selecccionarTodosClientes");
        res.status(200).send(resultado.recordset);
    } catch (err) {
        res.status(500).send ('Error al recuperar clientes: '+err.message);
    }
};

exports.obtenerClientePorID = async (req, res) => {
    const id_usuario = req.user.id_usuario; // Si la informacion del usuario existe la sesion es activa
    const id_cliente = req.params.id;

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const pool = await conectarDB();
        res.status(200).send(Cliente.obtenerCliente(id_cliente,pool));
    } catch (err) {
        res.status(404).send('Error al recuperar cliente: '+err.message);
    }
}

exports.crearCliente = async (req, res) => {
    const {razon, nombre, direccion, correo, telefono} = req.body;
    const id_usuario = req.user.id_usuario; // Si la informacion del usuario existe la sesion es activa

    if (!id_usuario) {
        return res.status(403).send('No autorizado: No has iniciado sesion.');
    }

    // Instanciamos al cliente que crearemos
    const cliente = new Cliente(null, razon, nombre, direccion, correo, telefono);

    try {
        const id_cliente = cliente.insertar();
        return res.status(200).send({id_cliente, message: 'El cliente ha sido creado con exito.'});
    } catch (err) {
        return res.status(400).send('Error al insertar al nuevo cliente: '+err.message);
    }
};

exports.editarCliente = async (req, res) => {
    const {razon, nombre, direccion, correo, telefono} = req.body;
    const id_cliente = req.params.id;

    const id_usuario = req.user.id_usuario; // Si la informacion del usuario existe la sesion es activa

    if (!id_usuario) {
        return res.status(403).send('No autorizado: No has iniciado sesion.');
    }

    // Instanciamos el cliente que enviaremos como la informacion actualizada a la db
    const cliente = new Cliente(id_cliente, razon, nombre, direccion, correo, telefono);

    try {
       await cliente.actualizar();
        return res.status(200).send('El cliente ha sido actualizado con exito.');
    } catch (err) {
        return res.status(400).send('Error al actualizar al cliente: '+err.message);
    }
};



