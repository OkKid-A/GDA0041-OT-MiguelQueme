import sql from 'mssql';
import sequelize from "../config/db.js";
import {DataTypes, QueryTypes} from "sequelize";

const Categoria = sequelize.define('categorias_productos', {
    id_categoria: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    id_estado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'estados',
            key: 'id_estado',
        }
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id_usuario',
        }
    }
});

Categoria.obtenerTodas = async function () {
    const [result] = await sequelize.query(`
        SELECT *
        FROM categoriasTodas;
    `, {
        type: QueryTypes.SELECT,
    })

    return result;
};

Categoria.obtenerActivas = async function () {
    const [result] = await sequelize.query(`
        SELECT *
        FROM categoriasActivas;
    `, {
        type: QueryTypes.SELECT,
    })

    return result;
};

Categoria.obtenerPorId = async function (id_categoria) {
    const [result] = await sequelize.query(`
    EXEC seleccionarCategoria
    @id_categoria = @id_categoria;
    `, {
        type: QueryTypes.SELECT,
    })

    return result[0];
};

Categoria.insertarCategoria = async function (categoriaBody) {
    const [results] = await sequelize.query(`
    EXEC insertarCategoriaProducto 
    @nombre = @nombre,
    @id_usuario = @id_usuario,
    @id_estado = @id_estado;`,{
        type: QueryTypes.SELECT,
        bind: {
            nombre: categoriaBody.nombre,
            id_usuario: categoriaBody.userId,
            id_estado: categoriaBody.id_estado,
        }
    })

    return results[0].id_categoria;
};

Categoria.actualizarCategoria = async function (categoriaBody) {
    const [result] = await sequelize.query(`
    EXEC actualizarCategoriaProducto
    @nombre = @nombre,
    @id_estado = @id_estado,
    @id_categoria = @id_categoria;`,{
        bind: {
            nombre: categoriaBody.nombre,
            id_estado: categoriaBody.id_estado,
            id_categoria: categoriaBody.id_categoria,
        }
    });

    return result;
};

Categoria.desactivarCategoria = async function (id_categoria){
    const [result] = await sequelize.query(`
    EXEC desactivarCategoria
    @id_categoria = @id_categoria;`,{
        bind:{
            id_categoria: id_categoria
        }
    })

    return result;
};
/*



    static async desactivarCategoria(pool, id_categoria) {
        await pool.request()
            .input('id_categoria', sql.Int, id_categoria)
            .execute(`desactivarCategoria`);
    }

    async actualizarCategoria(pool) {
        await pool.request()
            .input('id_categoria', sql.Int, this.id_categoria)
            .input('nombre', sql.NVarChar, this.nombre)
            .input('id_estado', sql.Int, this.id_estado)
            .execute(`actualizarCategoriaProducto`);

    }

    async insertarCategoria(pool, userId) {
        const resultado = await pool.request()
            .input('nombre', sql.NVarChar, this.nombre)
            .input('id_estado', sql.Int, this.id_estado)
            .input('id_usuario', sql.Int, userId)
            .execute(`insertarCategoriaProducto`);
        this.id_categoria = resultado.recordset[0].id_categoria;
        return this.id_categoria;
    }

    static async obtenerPorId(pool, id_categoria) {
        const resultado = await pool.request()
            .input('id_categoria', sql.Int, id_categoria)
            .execute(`seleccionarCategoria`);
        return resultado.recordset[0];
    }

class Categoria {
    constructor(id_categoria, nombre, id_estado, fecha_creacion) {
        this.id_categoria = id_categoria;
        this.nombre = nombre;
        this.id_estado = id_estado;
        this.fecha_creacion = fecha_creacion;
    }

    static async obtenerTodas(pool) {
        const resultado = await pool.request().query('SELECT * FROM categoriasTodas');
        return resultado.recordset;
    }

    static async obtenerActivas(pool) {
        const resultado = await pool.request().query('SELECT * FROM categoriasActivas');
        return resultado.recordset;
    }





}
*/


export default Categoria;
