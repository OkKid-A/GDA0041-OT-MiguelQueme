import sql from 'mssql';
import { conectarDB } from '../config/db.js';

class Cliente {
    constructor(id_cliente, razon, nombre, direccion, correo, telefono, id_estado) {
        this.id_cliente = id_cliente;
        this.razon = razon;
        this.nombre = nombre;
        this.direccion = direccion;
        this.correo = correo;
        this.telefono = telefono;
        this.id_estado = id_estado;
    }

    static async obtenerClientes(pool) {
        const resultado = await pool.request().query("SELECT * FROM seleccionarTodosClientes;");
        return resultado.recordset;
    }

    static async obtenerCliente(pool, id_cliente) {
        const resultado = await pool.request()
            .input('id_cliente', sql.Int, id_cliente)
            .execute("seleccionarCliente");
        return resultado.recordset[0];
    }

    async insertarCliente(pool) {
        const resultado = await pool.request()
            .input('razon_social', sql.NVarChar, this.razon)
            .input('nombre_comercial', sql.NVarChar, this.nombre)
            .input('direccion_entrega', sql.NVarChar, this.direccion)
            .input('correo_empresarial', sql.NVarChar, this.correo)
            .input('telefono_empresarial', sql.Int, this.telefono)
            .input('id_estado', sql.Int, this.id_estado)
            .execute("insertarCliente");
        this.id_cliente = resultado.recordset[0].id_cliente;
        return this.id_cliente;
    }

    async actualizarCliente(pool) {
        await pool.request()
            .input('id_cliente', sql.Int, this.id_cliente)
            .input('razon_social', sql.NVarChar, this.razon)
            .input('nombre_comercial', sql.NVarChar, this.nombre)
            .input('direccion_entrega', sql.NVarChar, this.direccion)
            .input('correo_empresarial', sql.NVarChar, this.correo)
            .input('telefono_empresarial', sql.Int, this.telefono)
            .execute("actualizarCliente");
    }

    static async desactivarCliente(pool, id_cliente) {
        await pool.request()
            .input('id_cliente', sql.Int, id_cliente)
            .execute(`desactivarCliente`);
    }
}

export default Cliente;
