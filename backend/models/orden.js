import sql from 'mssql';

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

    // Funcion para insertarUsuario una orden junto con el json de sus detalles
    static async insertarOrdenConDetalles(direccion,fecha_entrega, pool, json, id_usuario){
        await pool.request()
            .input('direccion_entrega',sql.NVarChar, direccion)
            .input('fecha_entrega', sql.Date, fecha_entrega)
            .input('id_usuario', sql.Int, id_usuario)
            .input('json', sql.NVarChar, json)
            .execute(`insertarOrdenConDetalles`);
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

    static async obtenerOrdenes(pool){
        return await pool.request()
            .query(`SELECT * FROM seleccionarTodasOrdenes;`);
    }

    static async obtenerOrdenPorId(pool, id_orden){
        return await pool.request()
            .input('id_orden', sql.Int, id_orden)
            .execute(`obtenerOrdenConDetalles`);
    }

    static async desactivarOrden(pool, id_orden){
        await pool.request()
            .input('id_orden', sql.Int, id_orden)
            .execute(`desactivarOrden`);
    }

    static async obetenerOrdenesDeUsuario(pool, id_usuario){
        return await pool.request()
            .input('id_usuario', sql.Int, id_usuario)
        .execute(`obtenerOrdenesPorUsuario`);
    }

    static async cancelarOrden(pool, id_orden){
        await pool.request()
            .input('id_orden', id_orden)
            .execute(`cancelarOrden`);
    }
}

export default Orden;
