const sql = require("../config/db");

class Producto {
    constructor(nombre, marca, codigo, stock, precio, foto, id_categoria, id_usuario, id_estado) {
        this.nombre = nombre;
        this.marca = marca;
        this.codigo = codigo;
        this.stock = stock;
        this.precio = precio;
        this.foto = foto;
        this.id_categoria = id_categoria;
        this.id_usuario = id_usuario;
        this.id_estado = id_estado;
    }

    static async insertar(producto, pool) {
        const result = await pool.request()
            .input('nombre', sql.NVarChar, producto.nombre)
            .input('marca', sql.NVarChar, producto.marca)
            .input('codigo', sql.NVarChar, producto.codigo)
            .input('stock', sql.Int, producto.stock)
            .input('precio', sql.Decimal, producto.precio)
            .input('foto', sql.NVarChar, producto.foto)
            .input('id_categoria', sql.Int, producto.id_categoria)
            .input('id_usuario', sql.Int, producto.id_usuario)
            .input('id_estado', sql.Int, producto.id_estado)
            .query(`
                EXEC insertarProducto
                @nombre = @nombre,
                @marca = @marca,
                @codigo = @codigo,
                @stock = @stock,
                @precio = @precio,
                @foto = @foto,
                @id_categoria = @id_categoria,
                @id_usuario = @id_usuario,
                @id_estado = @id_estado;
            `);

        return result.recordset[0].id_producto;
    }
}

module.exports = Producto;
