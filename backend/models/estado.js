import sql from 'mssql';
import sequelize from "../config/db.js";
import {DataTypes, QueryTypes} from "sequelize";

const Estado = sequelize.define('estados', {
    id_estado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},{
    timestamps: false,
});

Estado.insertarEstado = async function (nombre)  {
    const result = await sequelize.query(`
        EXEC insertarEstado 
        @nombre = :nombre;
    `, {
        replacements: {
            nombre: nombre
        },
        type: QueryTypes.SELECT
    });

    return result[0].id_estado;
}

Estado.actualizarEstado = async function (id_estado, nombre){
    const result = await sequelize.query(`
        EXEC actualizarEstado
        @id_estado = :id_estado,
        @nombre = :nombre;
    `, {
        replacements: {
            id_estado: id_estado,
            nombre: nombre || null
        }
    });

    return result;
};

Estado.seleccionarTodos = async function () {
    const result = await sequelize.query(`
        SELECT * FROM estadosTodos;
    `, {
        type: QueryTypes.SELECT
    });

    return result;
};

/*
class Estado {
    constructor(id_estado, nombre) {
        this.nombre = nombre;
        this.id_estado = id_estado;
    }

    async actualizarEstado(pool) {
        await pool.request()
            .input('nombre', sql.NVarChar(45) ,this.nombre)
            .input('id_estado', sql.Int, this.id_estado)
            .execute('actualizarEstado');
    }

    async insertarEstado(pool) {
        const resultado = await pool.request()
            .input('nombre', sql.NVarChar(45) ,this.nombre)
            .execute('insertarEstado');

        this.id_estado = resultado.recordset[0].id_estado;
        return this.id_estado;
    }

}
*/
export default Estado;