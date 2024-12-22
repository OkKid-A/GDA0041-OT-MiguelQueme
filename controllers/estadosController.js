import sql from 'mssql';
import { conectarDB } from '../config/db.js';
import Estado from '../models/estado.js';

export const obtenerEstados = async (req, res) => {
    const userId = req.user.id_usuario; // Confirmamos que el token exista en la request

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const pool = await conectarDB();
        const resultado = await pool.request().query('SELECT * FROM estadosTodos;');
        res.json(resultado.recordset);
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
        const estado = new Estado(null, nombre);
        const pool = await conectarDB();
        const id_estado = await estado.insertarEstado(pool);
        res.status(201).send({ id_estado, message: 'Estado creado exitosamente' });
    } catch (err) {
        res.status(500).send('Error al insertarUsuario el estado: ' + err.message);
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
        const estado = new Estado(id_estado, nombre);
        const pool = await conectarDB();
        await estado.actualizarEstado(pool);
        res.status(201).send({ id_estado, message: 'Estado editado exitosamente' });
    } catch (err) {
        res.status(500).send('Error al actualizarUsuario el estado: ' + err.message);
    }
};
