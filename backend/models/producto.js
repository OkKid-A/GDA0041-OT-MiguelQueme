import sql from 'mssql';
import sequelize from '../config/db.js';
import {DataTypes, QueryTypes} from "sequelize";

const Producto = sequelize.define('productos', {
    id_producto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    marca: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    codigo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    foto: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    id_categoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'categorias_productos',
            key: 'id_categoria',
        }
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id_usuario',
        }
    },
    id_estado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'estados',
            key: 'id_estado',
        }
    }
});

Producto.obtenerActivos = async function () {
    const [result] = await sequelize.query(`
        SELECT * FROM productosActivos;
    `, {
        type: QueryTypes.SELECT
    });

    return result;
};

Producto.obtenerTodos = async function () {
    const [result] = await sequelize.query(`
        SELECT * FROM seleccionarTodosProductos;
    `, {
        type: QueryTypes.SELECT
    });

    return result;
};

Producto.obtenerPorId = async function (id_producto) {
    const [result] = await sequelize.query(`
        EXEC seleccionarProducto
        @id_producto = :id_producto;
    `,{
        replacements: {
            id_producto: id_producto
        },
        type: QueryTypes.SELECT
    });

    return result[0];
};

Producto.insertarProducto = async function (productoBody){
    const [result] = await sequelize.query(`
        EXEC insertarProducto
        @nombre = :nombre,
        @marca = :marca,
        @codigo  = :codigo,
        @stock = :stock,
        @precio = :precio,
        @foto = :foto,
        @id_categoria = :id_categoria,
        @id_usuario = :id_usuario,
        @id_estado = :id_estado;
    `, {
        replacements: {
            nombre: productoBody.nombre,
            marca: productoBody.marca,
            codigo: productoBody.codigo,
            stock: productoBody.stock,
            precio: productoBody.precio,
            foto: productoBody.foto,
            id_categoria: productoBody.id_categoria,
            id_usuario: productoBody.id_usuario,
            id_estado: productoBody.id_estado,
        },
        type: QueryTypes.SELECT
    });

    return result[0].id_producto;
};

Producto.actualizarProducto = async function (productoBody) {
    const [result] = await sequelize.query(`
        EXEC actualizarProducto
        @id_producto = :id_producto,
        @nombre = :nombre,
        @marca = :marca,
        @codigo = :codigo,
        @stock = :stock,
        @precio = :precio,
        @foto = :foto,
        @id_categoria = :id_categoria,
        @id_estado = :id_estado;
    `, {
        replacements: {
            id_producto: productoBody.id_producto,
            nombre: productoBody.nombre,
            marca: productoBody.marca,
            codigo: productoBody.codigo,
            stock: productoBody.stock,
            precio: productoBody.precio,
            foto: productoBody.foto,
            id_categoria: productoBody.id_categoria,
            id_estado: productoBody.id_estado,
        }
    });

    return result;
};

Producto.desactivarProducto = async function (id_producto) {
    const [result] = sequelize.query(`
        EXEC desactivarProducto
        @id_producto = :id_producto;
    `, {
        replacements: {
            id_producto: id_producto,
        }
    });

    return result;
};
/*
    static async desactivar(pool, id_producto) {
        await pool.request()
            .input('id_producto', sql.Int, id_producto)
            .execute(`desactivarProducto`);
    }

    async actualizarProducto(pool) {
        await pool.request()
            .input('id_producto', sql.Int, this.id_producto)
            .input('nombre', sql.NVarChar, this.nombre)
            .input('marca', sql.NVarChar, this.marca)
            .input('codigo', sql.NVarChar, this.codigo)
            .input('stock', sql.Int, this.stock)
            .input('precio', sql.Float, this.precio)
            .input('foto', sql.NVarChar, this.foto)
            .input('id_categoria', sql.Int, this.id_categoria)
            .input('id_estado', sql.Int, this.id_estado)
            .execute(`actualizarProducto`);
    }

class Producto {

    async insertarProducto(pool, id_usuario) {
        const resultado = await pool.request()
            .input('nombre', sql.NVarChar, this.nombre)
            .input('marca', sql.NVarChar, this.marca)
            .input('codigo', sql.NVarChar, this.codigo)
            .input('stock', sql.Int, this.stock)
            .input('precio', sql.Float, this.precio)
            .input('foto', sql.NVarChar, this.foto)
            .input('id_categoria', sql.Int, this.id_categoria)
            .input('id_usuario', sql.Int, id_usuario)
            .input('id_estado', sql.Int, this.id_estado)
            .execute(`insertarProducto`);
        this.id_producto = resultado.recordset[0].id_producto;
        return this.id_producto;
    }

    static async obtenerTodos(pool) {
        const resultado = await pool.request().query('SELECT * FROM seleccionarTodosProductos');
        return resultado.recordset;
    }

    static async obtenerActivos(pool) {
        const resultado = await pool.request().query('SELECT * FROM productosActivos');
        return resultado.recordset;
    }

    static async obtenerPorId(pool, id_producto) {
        const resultado = await pool.request()
            .input('id_producto', sql.Int, id_producto)
            .execute(`seleccionarProducto`);
        return resultado.recordset[0];
    }




    static async desactivar(pool, id_producto) {
        await pool.request()
            .input('id_producto', sql.Int, id_producto)
            .execute(`desactivarProducto`);
    }

    static async
        constructor(id_producto, nombre, marca, codigo, stock, precio, foto, id_categoria, id_estado, fecha_creacion) {
        this.id_producto = id_producto;
        this.nombre = nombre;
        this.marca = marca;
        this.codigo = codigo;
        this.stock = stock;
        this.precio = precio;
        this.foto = foto;
        this.id_categoria = id_categoria;
        this.id_estado = id_estado;
        this.fecha_creacion = fecha_creacion;
    }

}
*/
export default Producto;
