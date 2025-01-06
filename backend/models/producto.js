import sql from 'mssql';
import { conectarDB } from '../config/db.js';

class Producto {
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

    static async desactivar(pool, id_producto) {
        await pool.request()
            .input('id_producto', sql.Int, id_producto)
            .execute(`desactivarProducto`);
    }

    static async
}

export default Producto;
