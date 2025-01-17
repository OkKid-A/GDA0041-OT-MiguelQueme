import sequelize from "../config/db.js";
import {DataTypes, QueryTypes} from "sequelize";

const Orden = sequelize.define('ordenes', {
    id_orden: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellidos: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fecha_entrega: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    total_orden: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    id_usuario:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_estado: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
},{
    timestamps: false,
});

const OrdenDetalle = sequelize.define('orden_detalles', {
    id_detalle: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    subtotal: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    id_orden: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'ordenes',
            key: 'id_orden',
        }
    },
    id_producto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'productos',
            key: 'id_producto',
        }
    }
},{
    timestamps: false,
});

// Funcion para insertar una orden junto con el json de sus detalles
Orden.insertarOrdenConDetalles = async function (direccion,fecha_entrega, json, id_usuario) {
    return await sequelize.query(`
        EXEC insertarOrdenConDetalles
        @direccion_entrega = :direccion_entrega,
        @fecha_entrega = :fecha_entrega,
        @id_usuario = :id_usuario,
        @json = :json;
    `, {
        replacements: {
            direccion_entrega: direccion,
            fecha_entrega: fecha_entrega,
            id_usuario: id_usuario,
            json: json,
        },
        type: QueryTypes.SELECT
    });
};

Orden.actualizarDetalles = async function (json, id_orden){
    return await sequelize.query(`
        EXEC actualizarDetallesDeOrden
        @id_orden = :id_orden,
        @json = :json;
        `, {
        replacements: {
            id_orden: id_orden,
            json: json,
        }
    });
};

Orden.actualizarOrden = async function (ordenBody){
    return await sequelize.query(`
        EXEC actualizarOrden 
        @id_orden = :id_orden,
        @nombre = :nombre,
        @apellido = :apellido,
        @direccion = :direccion,
        @telefono = :telefono,
        @correo = :correo,
        @fecha_entrega = :fecha_entrega,
        @total_orden = :total_orden,
        @id_estado = :id_estado;
    `, {
        replacements: {
            id_orden: ordenBody.id_orden,
            nombre: ordenBody.nombre || null,
            apellido: ordenBody.apellido || null,
            direccion: ordenBody.direccion || null,
            telefono: ordenBody.telefono || null,
            correo: ordenBody.correo || null,
            fecha_entrega: ordenBody.fecha_entrega || null,
            total_orden: ordenBody.total_orden || null,
            id_estado: ordenBody.id_estado || null,
        }
    });
};

Orden.obtenerOrdenPorId = async function (id_orden){
    const result =  await sequelize.query(`
        EXEC obtenerOrdenConDetalles
        @id_orden = :id_orden;
    `, {
        replacements: {
            id_orden: id_orden,
        },
        type: QueryTypes.SELECT
    });
    console.log(result);
    // Sequelize separa el json cuando es demasiado grande, aqui lo parseamos en una sola string
    if (Array.isArray(result) && result.length > 0) {
        let jsonString = '';
        for (const item of result) {
            jsonString += item['JSON_F52E2B61-18A1-11d1-B105-00805F49916B'] || '';
        }
        console.log('JSON String:', jsonString);
        // Encapsulamos al Json en un objeto
        return {'JSON_F52E2B61-18A1-11d1-B105-00805F49916B': jsonString};
    } else {
        return result;
    }
};

Orden.cancelarOrden = async function (id_orden){
    return await sequelize.query(`
        EXEC cancelarOrden
        @id_orden = :id_orden;
    `, {
         replacements: {
             id_orden: id_orden
         }
     });
};

Orden.desactivarOrden = async function (id_orden){
    return await sequelize.query(`
        EXEC desactivarOrden
        @id_orden = :id_orden;
    `, {
        replacements: {
            id_orden: id_orden
        }
    });
};

Orden.obtenerOrdenesDeUsuario = async function (id_usuario){
    return await sequelize.query(`
        EXEC obtenerOrdenesPorUsuario
        @id_usuario = :id_usuario;
    `, {
        replacements: {
            id_usuario: id_usuario,
        },
        type: QueryTypes.SELECT
    });
};

Orden.obtenerOrdenes = async function () {
    return await sequelize.query(`
        SELECT * FROM seleccionarTodasOrdenes;
    `, {
        type: QueryTypes.SELECT
    });
}

/*
    static async obtenerOrdenes(pool){
        return await pool.request()
            .query(`SELECT * FROM seleccionarTodasOrdenes;`);
    }

    static async obetenerOrdenesDeUsuario(pool, id_usuario){
        return await pool.request()
            .input('id_usuario', sql.Int, id_usuario)
        .execute(`obtenerOrdenesPorUsuario`);
    }

    static async desactivarOrden(pool, id_orden){
        await pool.request()
            .input('id_orden', sql.Int, id_orden)
            .execute(`desactivarOrden`);
    }

    static async cancelarOrden(pool, id_orden){
        await pool.request()
            .input('id_orden', id_orden)
            .execute(`cancelarOrden`);
    }

    static async obtenerOrdenPorId(pool, id_orden){
        return await pool.request()
            .input('id_orden', sql.Int, id_orden)
            .execute(`obtenerOrdenConDetalles`);
    }

    async actualizarOrden(pool){
        await pool.request()
            .input('id_orden', sql.Int, this.id_orden)
            .input('nombre', sql.NVarChar(45), this.nombre)
            .input('apellido', sql.NVarChar(45), this.apellido)
            .input('direccion', sql.NVarChar(545), this.direccion)
            .input('telefono', sql.VarChar(8), this.telefono)
            .input('correo', sql.NVarChar(128), this.correo)
            .input('fecha_entrega', sql.Date, this.fecha_entrega)
            .input('total_orden', sql.Float, this.total_orden)
            .input('id_estado', sql.Int, this.id_estado)
            .execute('actualizarOrden');
    }

    static async actualizarDetalles(json, id_orden, pool){
        await pool.request()
            .input('id_orden', sql.Int, id_orden)
            .input('json', sql.NVarChar ,json)
            .execute(`actualizarDetallesDeOrden`);
    }

    // Funcion para insertarUsuario una orden junto con el json de sus detalles
    static async insertarOrdenConDetalles(direccion,fecha_entrega, pool, json, id_usuario){
        await pool.request()
            .input('direccion_entrega',sql.NVarChar, direccion)
            .input('fecha_entrega', sql.Date, fecha_entrega)
            .input('id_usuario', sql.Int, id_usuario)
            .input('json', sql.NVarChar, json)
            .execute(`insertarOrdenConDetalles`);
    }

class Orden {
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





    async actualizarOrden(pool){
        await pool.request()
            .input('id_orden', sql.Int, this.id_orden)
            .input('nombre', sql.NVarChar(45), this.nombre)
            .input('apellido', sql.NVarChar(45), this.apellido)
            .input('direccion', sql.NVarChar(545), this.direccion)
            .input('telefono', sql.VarChar(8), this.telefono)
            .input('correo', sql.NVarChar(128), this.correo)
            .input('fecha_entrega', sql.Date, this.fecha_entrega)
            .input('total_orden', sql.Float, this.total_orden)
            .input('id_estado', sql.Int, this.id_estado)
            .execute('actualizarOrden');
    }









}
*/
export default Orden ;
