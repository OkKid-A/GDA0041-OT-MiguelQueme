const sql = require('mssql');
const { conectarDB } = require('../config/db'); // Adjust the path to your actual db.js location

class Order {
    constructor(id_orden, nombre, apellido, direccion, telefono, correo, fecha_entrega, total_orden, fecha_creacion, id_usuario, id_estado) {
        this.id_orden = id_orden;
        this.nombre = nombre;
        this.apellido = apellido;
        this.direccion = direccion;
        this.telefono = telefono;
        this.correo = correo;
        this.fecha_entrega = fecha_entrega;
        this.total_orden = total_orden;
        this.fecha_creacion = fecha_creacion;
        this.id_usuario = id_usuario;
        this.id_estado = id_estado;
    }

    // Funcion para insertar una orden junto con el json de sus detalles
    static async insertarOrdenConDetalles(fecha_entrega, pool, json, id_usuario){

        const resultado = await pool.request()
            .input('fecha_entrega', fecha_entrega)
            .input('id_usuario', id_usuario)
            .input('json', json)
            .execute(`insertarOrdenConDetalles`);

        return resultado.recordset[0];
    };

    async actualizarOrden(pool){

        await pool.request()
            .input('id_orden', sql.Int, order.id_orden)
            .input('nombre', sql.NVarChar(45), order.nombre)
            .input('apellido', sql.NVarChar(45), order.apellido)
            .input('direccion', sql.NVarChar(545), order.direccion)
            .input('telefono', sql.VarChar(8), order.telefono)
            .input('correo', sql.NVarChar(128), order.correo)
            .input('fecha_entrega', sql.Date, order.fecha_entrega)
            .input('total_orden', sql.Float, order.total_orden)
            .input('id_estado', sql.Int, order.id_estado)
            .execute('actualizarOrden');
    };
}

module.exports = Order;
