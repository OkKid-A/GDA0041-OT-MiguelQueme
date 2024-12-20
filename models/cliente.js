const {sql, conectarDB} = require("../config/db");
const {pool} = require("mssql/lib/global-connection");

class Cliente {
    constructor(id_cliente,razon, nombre, direccion, correo, telefono) {
        this.id_cliente = id_cliente;
        this.razon = razon;
        this.nombre = nombre;
        this.direccion = direccion;
        this.correo = correo;
        this.telefono = telefono;
    }

    async insertar() {
        const pool = await conectarDB();

        const result = await pool.request()
            .input('razon_social', sql.NVarChar, this.razon)
            .input('nombre_comercial', sql.NVarChar, this.nombre)
            .input('direccion_entrega', sql.NVarChar, this.direccion)
            .input('correo_empresarial', sql.NVarChar, this.correo)
            .input('telefono_empresarial', sql.VarChar, this.telefono)
            .query(`
            EXEC insertarCliente
            @razon_social = @razon_social,
            @nombre_comercial = @nombre_comercial,
            @direccion_entrega = @direccion_entrega,
            @correo_empresarial = @correo_empresarial,
            @telefono_empresarial = @telefono_empresarial;
        `);

        return result.recordset[0].id_cliente;
    }

    async actualizar() {
        const pool = await conectarDB();

        await pool.request()
            .input('id_cliente', sql.Int, this.id_cliente)
            .input('razon_social', sql.NVarChar, this.razon)
            .input('nombre_comercial', sql.NVarChar, this.nombre)
            .input('direccion_entrega', sql.NVarChar, this.direccion)
            .input('correo_empresarial', sql.NVarChar, this.correo)
            .input('telefono_empresarial', sql.VarChar, this.telefono)
            .query(`
            EXEC actualizarCliente
            @id_cliente = @id_cliente,
            @razon_social = @razon_social,
            @nombre_comercial = @nombre_comercial,
            @direccion_entrega = @direccion_entrega,
            @correo_empresarial = @correo_empresarial,
            @telefono_empresarial = @telefono_empresarial;
        `);
    }

}

module.exports = Cliente;