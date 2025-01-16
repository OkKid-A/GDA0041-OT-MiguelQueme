import Orden from '../models/orden.js';

export const obtenerOrdenes = async (req, res) => {
    const id_usuario = req.user.id_usuario; // Si la informacion del usuario existe la sesion es activa

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const resultado = await Orden.obtenerOrdenes();
        return res.status(200).send(resultado);
    } catch (err) {
        return res.status(401).send('Error al recuperar las ordenes: ' + err.message);
    }
}

export const insertarOrdenConDetalle = async (req, res) => {
    const id_usuario = req.user.id_usuario; // Si la informacion del usuario existe la sesion es activa
    const { direccion,fecha_entrega, json } = req.body;

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const jsonString = JSON.stringify(json);
        await Orden.insertarOrdenConDetalles(direccion,fecha_entrega, jsonString, id_usuario);
        res.status(200).send('Orden ingresada con éxito.');
    } catch (err) {
        res.status(500).send('Error al ingresar la orden: ' + err.message);
    }
};

export const actualizarDetalles = async (req, res) => {
    const id_usuario = req.user.id_usuario;
    const id_orden = req.params.id;
    const {json} = req.body;

    if (!id_usuario){
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    if (!id_orden) {
        return res.status(404).send('No se encontro un id_orden' + req.params.id)
    }

    try {
        const jsonString = JSON.stringify(json);
        await Orden.actualizarDetalles(jsonString, id_orden);
        res.status(200).send( {message:'Orden actualizada con éxito.', json:jsonString } );
    } catch (err) {
        res.status(500).send('Error al actualizar la orden: ' + err.message);
    }
}

export const actualizarOrden = async (req, res) => {
    const id_usuario = req.user.id_usuario;
    const id_orden = req.params.id;
    const { nombre, apellido, direccion, telefono, correo, fecha_entrega, total_orden, id_estado } = req.body;

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    if (!id_orden) {
        return res.status(404).send('No se encontro un id_orden' + req.params.id)
    }

    try {
        await Orden.actualizarOrden(id_orden, nombre, apellido, direccion, telefono, correo, fecha_entrega, total_orden, id_estado);
        res.status(200).send({ message: 'Orden actualizada con éxito.' });
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
        const resultado = await Orden.obtenerOrdenPorId(id_orden);

        if (resultado.length === 0) {
            return res.status(404).json('La orden no existe.');
        }
        console.log(resultado);
        const ordenJson = resultado[0];
        res.status(200).send(ordenJson);
    } catch (err) {
        res.status(500).send('Error al recuperar la orden: ' + err.message);
    }
};

// Endpoint para que el usuario cancele una orden antes de que sea entregada
export const cancelarOrden = async (req, res) => {
    const id_orden = req.params.id;
    const id_usuario = req.user.id_usuario;

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        await Orden.cancelarOrden( id_orden);
        res.status(200).send('Se ha cancelado la orden con éxito.');
    } catch (err) {
        res.status(500).send('Error al cancelar la orden: ' + err.message);
    }
};

// Endpoint para que el operador desactive la orden
export const desactivarOrden = async (req, res) => {
    const id_orden = req.params.id;
    const id_usuario = req.user.id_usuario;

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        await Orden.desactivarOrden( id_orden);
        res.status(200).send('Se ha desactivado la orden con éxito.');
    } catch (err) {
        res.status(500).send('Error al desactivar la orden: ' + err.message);
    }
};

export const obtenerOrdenesCliente = async (req, res) => {
    const id_usuario = req.user.id_usuario;
    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        console.log(id_usuario)
        const resultado = await Orden.obtenerOrdenesDeUsuario(id_usuario);
        if (resultado.length === 0) {
            return res.status(404).json('El usuario no existe.');
        }
        return res.status(200).send(resultado);
    } catch (err) {
        return res.status(401).send('Error al recuperar las ordenes: del usuario ' + err.message);
    }
};
