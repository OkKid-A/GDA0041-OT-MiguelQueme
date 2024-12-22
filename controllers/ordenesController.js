import { conectarDB } from '../config/db.js';
import Orden from '../models/orden.js';

export const obtenerOrdenes = async (req, res) => {
    const id_usuario = req.user.id_usuario; // Si la informacion del usuario existe la sesion es activa

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const pool = await conectarDB();
        const resultado = await Orden.obtenerOrdenes(pool);
        return res.status(200).send(resultado.recordset);
    } catch (err) {
        return res.status(401).send('Error al recuperar las ordenes: ' + err.message);
    }
}

export const insertarOrdenConDetalle = async (req, res) => {
    const id_usuario = req.user.id_usuario; // Si la informacion del usuario existe la sesion es activa
    const { fecha_entrega, json } = req.body;

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const pool = await conectarDB();
        await Orden.insertarOrdenConDetalles(fecha_entrega, pool, json, id_usuario);
        res.status(200).send('Orden ingresada con éxito.');
    } catch (err) {
        res.status(500).send('Error al ingresar la orden: ' + err.message);
    }
};

export const actualizarOrden = async (req, res) => {
    const id_usuario = req.user.id_usuario;
    const { id_orden } = req.params.id;
    const { nombre, apellido, direccion, telefono, correo, fecha_entrega, total_orden, id_estado } = req.body;

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    const orden = new Orden(
        id_orden,
        nombre,
        apellido,
        direccion,
        telefono,
        correo,
        fecha_entrega,
        total_orden,
        null, // fecha_creacion is not updated
        null, // id_usuario is not updated
        id_estado
    );

    try {
        const pool = await conectarDB();
        await orden.actualizarOrden(pool);
        res.status(200).send({ orden, message: 'Orden actualizada con éxito.' });
    } catch (err) {
        res.status(500).send('Error al actualizar la orden: ' + err.message);
    }
};

export const obtenerOrdenPorID = async (req, res) => {
    const id_orden = req.params.id;
    const id_usuario = req.user.id_usuario;

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const pool = await conectarDB();
        const resultado = await Orden.obtenerOrdenPorId(pool, id_orden);

        if (resultado.recordset.length === 0) {
            return res.status(404).json('La orden no existe.');
        }

        const ordenJson = resultado.recordset[0];
        res.status(200).send(ordenJson);
    } catch (err) {
        res.status(500).send('Error al recuperar la orden: ' + err.message);
    }
};

export const desactivarOrden = async (req, res) => {
    const id_orden = req.params.id;
    const id_usuario = req.user.id_usuario;

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const pool = await conectarDB();
        await Orden.desactivarOrden(pool, id_orden);
        res.status(200).send('Se ha desactivado la orden con éxito.');
    } catch (err) {
        res.status(500).send('Error al desactivar la orden: ' + err.message);
    }
};
