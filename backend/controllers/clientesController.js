import Cliente from '../models/cliente.js';
import Categoria from "../models/categoria.js";

export const obtenerClientes = async (req, res) => {
    const id_usuario = req.user.id_usuario; // Si la informacion del usuario existe la sesion es activa

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const clientes = await Cliente.obtenerClientes();
        res.status(200).send(clientes);
    } catch (err) {
        res.status(500).send('Error al recuperar clientes: ' + err.message);
    }
};

export const obtenerClientePorID = async (req, res) => {
    const id_usuario = req.user.id_usuario; // Si la informacion del usuario existe la sesion es activa
    const id_cliente = req.params.id;

    if (!id_usuario) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const cliente = await Cliente.obtenerCliente(id_cliente);
        res.status(200).send(cliente);
    } catch (err) {
        res.status(404).send('Error al recuperar cliente: ' + err.message);
    }
}

export const crearCliente = async (req, res) => {
    const { razon_social, nombre_comercial, direccion_entrega, correo_empresarial, telefono_empresarial, id_estado } = req.body;
    const id_usuario = req.user.id_usuario; // Si la informacion del usuario existe la sesion es activa

    if (!id_usuario) {
        return res.status(403).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const id_cliente = await Cliente.insertarCliente({
            razon_social, nombre_comercial, direccion_entrega, correo_empresarial, telefono_empresarial, id_estado}
        );
        return res.status(200).send({ id_cliente, message: 'El cliente ha sido creado con exito.' });
    } catch (err) {
        return res.status(400).send('Error al insertar al nuevo cliente: ' + err.message);
    }
};

export const editarCliente = async (req, res) => {
    const { razon_social, nombre_comercial, direccion_entrega, correo_empresarial, telefono_empresarial, id_estado } = req.body;
    const id_cliente = req.params.id;

    const id_usuario = req.user.id_usuario; // Si la informacion del usuario existe la sesion es activa

    if (!id_usuario) {
        return res.status(403).send('No autorizado: No has iniciado sesion.');
    }

    try {
        await Cliente.actualizarCliente({id_cliente, razon_social, nombre_comercial, direccion_entrega, correo_empresarial, telefono_empresarial, id_estado});
        return res.status(200).send('El cliente ha sido actualizado con exito.');
    } catch (err) {
        return res.status(400).send('Error al actualizar al cliente: ' + err.message);
    }
};

export const desactivarCliente = async (req, res) => {
    const id_cliente = req.params.id;
    const userId = req.user.id_usuario;

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        await Cliente.desactivarCliente(id_cliente);
        res.status(200).send('Cliente desactivado con exito.');
    } catch (err) {
        res.status(500).send('Error al intentar desactivar el cliente: ' + err.message);
    }
};

