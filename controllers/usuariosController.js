const {conectarDB,sql} = require("../config/db");
const crypto = require("crypto");
const Usuario = require("../models/usuario");

exports.obtenerUsuarios = async (req, res) => {
    const id_usuario = req.user.id_usuario; // Confirmamos que el token exista en la request

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const pool = await conectarDB();

        const resultado = await pool.request()
            .query("SELECT * FROM selecccionarTodosUsuario");
        res.status(200).send(resultado.recordset);
    } catch (err) {
        res.status(500).send ('Error al recuperar usuarios: '+err.message);
    }
};

exports.insertarUsuario = async (req, res) => {
    const id_usuario = req.user.id_usuario; // Confirmamos que el token exista en la request

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    const {correo, password, nombre, apellido, telefono, fecha_nacimiento, id_rol, id_estado, id_cliente} = req.body;
    // Encriptamos la contraseña en sha256 antes de enviarla al frontend
    const hash = crypto.createHash('sha256');
    hash.update(password);
    const passEncriptada = hash.digest('hex');

    // Creamos un objeto Usuario
    const nuevoUsuario = new Usuario(null,correo,nombre,apellido, telefono, fecha_nacimiento,passEncriptada, id_rol, id_estado, id_cliente);

    try {
        // Insertamos el Usuario con la contraseña encriptada
        const id_usuario = await nuevoUsuario.insertar();
        res.status(200).send({id_usuario, message: 'Usuario creado exitosamente.'});
    } catch (err) {
        res.status(500).send('Error al insertar usuario: '+err.message);
    }
};

exports.editarUsuario = async (req, res) => {
    const { correo,nombre, apellido, telefono, fecha_nacimiento, id_rol, id_estado, id_cliente} = req.body;
    const id = req.params.id;
    const id_usuario = req.user.id_usuario;

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    // Creamos el objeto del usuario actualizado
    const usuarioActualizado = new Usuario(id, correo, nombre, apellido, telefono, fecha_nacimiento, id_rol, id_estado, id_cliente);

    try {
        // Actulizamos en la base de datos
        await usuarioActualizado.actualizar();
        res.status(200).send({message: 'Usuario actualizado exitosamente.'});
    } catch (err) {
        res.status(500).send('Error al actualizar al usuario: '+err.message);
    }
};

exports.desactivarUsuario = async (req, res) => {
    const id = req.params.id;

    const id_usuario = req.user.id_usuario;

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        // Usamos una funcion estatica para desactivar al usuario
        await Usuario.desactivar(id);
        res.status(200).send({message: 'Usuario desactivado exitosamente.'});
    } catch (err) {
        res.status(500).send('Error al desactivar usuario: '+err.message);
    }
}