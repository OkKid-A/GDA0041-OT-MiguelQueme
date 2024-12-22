import { conectarDB } from '../config/db.js';
import Usuario from '../models/usuario.js';
import crypto from 'crypto';

export const obtenerUsuarios = async (req, res) => {
    const id_usuario = req.user.id_usuario; // Confirmamos que el token exista en la request

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const pool = await conectarDB();
        const usuarios = await Usuario.obtenerUsuarios(pool);
        res.status(200).send(usuarios);
    } catch (err) {
        res.status(500).send('Error al recuperar usuarios: ' + err.message);
    }
};

export const insertarUsuario = async (req, res) => {
    const id_usuario = req.user.id_usuario; // Confirmamos que el token exista en la request

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    const { correo, password, nombre, apellido, telefono, fecha_nacimiento, id_rol, id_estado, id_cliente } = req.body;
    // Encriptamos la contraseña en sha256 antes de enviarla al frontend
    const hash = crypto.createHash('sha256');
    hash.update(password);
    const passEncriptada = hash.digest('hex');

    // Creamos un objeto Usuario
    const nuevoUsuario = new Usuario(null, correo, nombre, apellido, telefono, fecha_nacimiento, id_rol, id_estado, id_cliente);

    try {
        const pool = await conectarDB();
        // Insertamos el Usuario con la contraseña encriptada
        const usuarioId = await nuevoUsuario.insertarUsuario(passEncriptada,pool);
        res.status(200).send({ id_usuario: usuarioId, message: 'Usuario creado exitosamente.' });
    } catch (err) {
        res.status(500).send('Error al insertar al usuario: ' + err.message);
    }
};

export const editarUsuario = async (req, res) => {
    const { correo, nombre, apellido, telefono, fecha_nacimiento, id_rol, id_estado, id_cliente } = req.body;
    const id = req.params.id;
    const id_usuario = req.user.id_usuario;

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    // Creamos el objeto del usuario actualizado
    const usuarioActualizado = new Usuario(id, correo, nombre, apellido, telefono, fecha_nacimiento, null, id_rol, id_estado, id_cliente);

    try {
        const pool = await conectarDB();
        // Actualizamos en la base de datos
        await usuarioActualizado.actualizarUsuario(pool);
        res.status(200).send( 'Usuario actualizado exitosamente.' );
    } catch (err) {
        res.status(500).send('Error al actualizar al usuario: ' + err.message);
    }
};

export const desactivarUsuario = async (req, res) => {
    const id = req.params.id;

    const id_usuario = req.user.id_usuario;

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const pool = await conectarDB();
        // Usamos una funcion estatica para desactivarCategoria al usuario
        await Usuario.desactivarUsuarios(pool, id);
        res.status(200).send({ message: 'Usuario desactivado exitosamente.' });
    } catch (err) {
        res.status(500).send('Error al desactivar el usuario: ' + err.message);
    }
};
