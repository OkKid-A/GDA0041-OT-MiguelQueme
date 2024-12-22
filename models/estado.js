import sql from 'mssql';

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

export default Estado;