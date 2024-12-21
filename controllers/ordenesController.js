const {sql, conectarDB}= require('../config/db');
const Order = require("../models/orden");

exports.insertarOrdenConDetalle = async (req, res) => {
    const id_usuario = req.user.id_usuario; // Si la informacion del usuario existe la sesion es activa
    const {fecha_entrega,json} = req.body;

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const pool = await conectarDB();
        const resultado = Orden.insertarOrdenConDetalles(fecha_entrega,pool,json,id_usuario);
        res.status(200).send('Orden ingresada con éxito.');
    } catch (err) {
        res.status(500).send('Error la ingresar la orden: '+err.message);
    }
}

exports.actualizarOrden = async (req, res) => {
    const id_usuario = req.user.id_usuario;
    const { id_orden } = req.params;
    const { nombre, apellido, direccion, telefono, correo, fecha_entrega, total_orden, id_estado } = req.body;

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    const order = new Order(
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
        await order.actualizarOrden(pool);
        res.status(200).send({order,message:'Orden actualizada con éxito.'});
    } catch (err) {
        res.status(500).send('Error la actualizar la orden: '+err.message);
    }
}
