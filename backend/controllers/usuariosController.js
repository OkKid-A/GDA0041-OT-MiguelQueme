import Usuario from '../models/usuario.js';
import crypto from 'crypto';

export const obtenerUsuarios = async (req, res) => {
    const id_usuario = req.user.id_usuario; // Confirmamos que el token exista en la request

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const usuarios = await Usuario.obtenerUsuarios();
        const sinOrigen = usuarios.filter((usuario) => usuario.id_usuario !== id_usuario);
        res.status(200).send(sinOrigen);
    } catch (err) {
        res.status(500).send('Error al recuperar usuarios: ' + err.message);
    }
};

// Endpoint para verificar que el correo de un usuario es unico
export const verificarUnico = async (req, res) => {
    const id_usuario = req.user.id_usuario; // Confirmamos que el token exista en la request
    const { correo } = req.params;

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const result = Usuario.verificarUnico(correo);

        if (result.length > 0) {
            res.json({ isUnique: false });
        } else {
            res.json({ isUnique: true });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error al intentar verificar si el correo es unico', details: err });
    }
};

export const insertarUsuario = async (req, res) => {
    const id_usuario = req.user.id_usuario; // Confirmamos que el token exista en la request

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    const { correo, password, nombre, apellido, telefono, fecha_nacimiento, id_rol, id_estado, id_cliente, direccion } = req.body;
    // Encriptamos la contraseña en sha256 antes de enviarla al frontend
    const hash = crypto.createHash('sha256');
    hash.update(password);
    const passEncriptada = hash.digest('hex');

    // Creamos un objeto Usuario

    try {
        // Insertamos el Usuario con la contraseña encriptada
        const nuevoUsuarioId = await Usuario.insertarUsuario(
            correo,nombre, apellido, telefono, fecha_nacimiento, id_rol, id_estado,id_cliente, direccion, password
        )
        res.status(200).send({ id_usuario: nuevoUsuarioId, message: 'Usuario creado exitosamente.' });
    } catch (err) {
        res.status(500).send('Error al insertar al usuario: ' + err.message);
    }
};

export const editarUsuario = async (req, res) => {
    const { correo, nombre, apellido, telefono, fecha_nacimiento, id_rol, id_estado, id_cliente, direccion } = req.body;
    const id = req.params.id;
    const id_usuario = req.user.id_usuario;

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        // Actualizamos en la base de datos
        await Usuario.actualizarUsuario(id, correo, nombre, apellido, telefono, fecha_nacimiento, id_rol, id_estado, id_cliente, direccion);
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
        // Usamos una funcion estatica para desactivar al usuario
        await Usuario.desactivarUsuarios(id);
        res.status(200).send({ message: 'Usuario desactivado exitosamente.' });
    } catch (err) {
        res.status(500).send('Error al desactivar el usuario: ' + err.message);
    }
};

export const activarUsuario = async (req, res) => {
    const id = req.params.id;

    const id_usuario = req.user.id_usuario;

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        // Usamos una funcion estatica para activar al usuario
        await Usuario.activarUsuarios(id);
        res.status(200).send({ message: 'Usuario desactivado exitosamente.' });
    } catch (err) {
        res.status(500).send('Error al desactivar el usuario: ' + err.message);
    }
};
