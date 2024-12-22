import sql from 'mssql';
import { conectarDB } from '../config/db.js';

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

    static async obtenerPorId(pool, id_categoria) {
        const resultado = await pool.request()
            .input('id_categoria', sql.Int, id_categoria)
            .execute(`seleccionarCategoria`);
        return resultado.recordset[0];
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

    async actualizarCategoria(pool) {
        const resultado = await pool.request()
            .input('id_categoria', sql.Int, this.id_categoria)
            .input('nombre', sql.NVarChar, this.nombre)
            .input('fecha_creacion', sql.Date, this.fecha_creacion)
            .input('id_estado', sql.Int, this.id_estado)
            .execute(`actualizarCategoriaProducto`);

    }

    static async desactivarCategoria(pool, id_categoria) {
        const resultado = await pool.request()
            .input('id_categoria', sql.Int, id_categoria)
            .execute(`desactivarCategoria`);
    }
}

export default Categoria;
