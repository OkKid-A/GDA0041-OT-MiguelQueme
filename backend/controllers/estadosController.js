import sql from 'mssql';
import Estado from '../models/estado.js';

export const obtenerEstados = async (req, res) => {
    const userId = req.user.id_usuario; // Confirmamos que el token exista en la request

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const resultado = await Estado.seleccionarTodos();
        res.json(resultado);
    } catch (err) {
        res.status(404).send('Error al recuperar productos activos: ' + err.message);
    }
};

export const insertarEstado = async (req, res) => {
    const { nombre } = req.body;
    const userId = req.user.id_usuario; // Confirmamos que el token exista en la request

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const id_estado = await Estado.insertarEstado(nombre);
        res.status(201).send({ id_estado, message: 'Estado creado exitosamente' });
    } catch (err) {
        res.status(500).send('Error al insertar el estado: ' + err.message);
    }
};

export const editarEstado = async (req, res) => {
    const { nombre } = req.body;
    const userId = req.user.id_usuario; // Confirmamos que el token exista en la request
    const id_estado = req.params.id;

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        await Estado.actualizarEstado(id_estado, nombre);
        res.status(201).send({ id_estado, message: 'Estado editado exitosamente' });
    } catch (err) {
        res.status(500).send('Error al actualizar el estado: ' + err.message);
    }
};
