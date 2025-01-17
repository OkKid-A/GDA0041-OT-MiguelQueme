import sequelize from '../config/db.js';
import {DataTypes, QueryTypes} from "sequelize";

const Cliente = sequelize.define('clientes', {
    id_cliente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    razon_social: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nombre_comercial: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    direccion_entrega: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    correo_empresarial: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telefono_empresarial: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    id_estado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'estados',
            key: 'id_estado',
        }
    }
},{
    timestamps: false,
});

Cliente.obtenerClientes = async function () {
    const result = await sequelize.query(`
    SELECT * FROM seleccionarTodosClientes;`,
        {
            type: QueryTypes.SELECT,
        });

    return result;
};

Cliente.obtenerCliente = async function (id_cliente) {
    const result = await sequelize.query(`
        EXEC seleccionarCliente
        @id_cliente = :id_cliente;
    `, {
        type: QueryTypes.SELECT,
        replacements: {
            id_cliente: id_cliente,
        }
    })

    return result[0];
};

Cliente.insertarCliente = async function (clienteBody){
    const result = await sequelize.query(`
        EXEC insertarCliente
        @razon_social = :razon_social,
        @nombre_comercial = :nombre_comercial,
        @direccion_entrega = :direccion_entrega,
        @correo_empresarial = :correo_empresarial,
        @telefono_empresarial = :telefono_empresarial,
        @id_estado = :id_estado; 
    `, {
        replacements: {
            razon_social: clienteBody.razon_social,
            nombre_comercial: clienteBody.nombre_comercial,
            direccion_entrega: clienteBody.direccion_entrega,
            correo_empresarial: clienteBody.correo_empresarial,
            telefono_empresarial: clienteBody.telefono_empresarial,
            id_estado: clienteBody.id_estado,
        },
        type: QueryTypes.SELECT,
    })
    return result[0].id_cliente;
};

Cliente.actualizarCliente = async function (clienteBody){
    const result = await sequelize.query(`
        EXEC actualizarCliente
        @id_cliente = :id_cliente,
        @razon_social = :razon_social,
        @nombre_comercial = :nombre_comercial,
        @direccion_entrega = :direccion_entrega,
        @correo_empresarial = :correo_empresarial,
        @telefono_empresarial = :telefono_empresarial,
        @id_estado = :id_estado;
    `, {
        replacements: {
            id_cliente: clienteBody.id_cliente,
            razon_social: clienteBody.razon_social || null,
            nombre_comercial: clienteBody.nombre_comercial || null,
            direccion_entrega: clienteBody.direccion_entrega || null,
            correo_empresarial: clienteBody.correo_empresarial || null,
            telefono_empresarial: clienteBody.telefono_empresarial || null,
            id_estado: clienteBody.id_estado || null,
        }
    });

    return result;
};

Cliente.desactivarCliente = async function (id_cliente) {
    const result = await sequelize.query(`
        EXEC desactivarCliente
        @id_cliente = :id_cliente;
    `, {
        replacements: {
            id_cliente: id_cliente,
        }
    });

    return result;
};

/*
    static async desactivarCliente(pool, id_cliente) {
        await pool.request()
            .input('id_cliente', sql.Int, id_cliente)
            .execute(`desactivarCliente`);
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




}
*/
export default Cliente;
