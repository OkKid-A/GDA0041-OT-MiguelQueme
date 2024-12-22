import sql from 'mssql';
import { conectarDB } from '../config/db.js';

class Cliente {
    constructor(id_cliente, razon, nombre, direccion, correo, telefono) {
        this.id_cliente = id_cliente;
        this.razon = razon;
        this.nombre = nombre;
        this.direccion = direccion;
        this.correo = correo;
        this.telefono = telefono;
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
}

export default Cliente;
