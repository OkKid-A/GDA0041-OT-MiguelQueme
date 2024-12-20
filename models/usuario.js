const {sql, conectarDB} = require("../config/db");
const {pool} = require("mssql/lib/global-connection");

class Usuario {
    constructor(id_usuario, correo, nombre, apellido, telefono, fecha_nacimiento, rol, id_cliente, estado) {
        this.id_usuario = id_usuario;
        this.correo = correo;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.fecha_nacimiento = fecha_nacimiento;
        this.rol = rol;
        this.id_cliente = id_cliente;
        this.estado = estado;
    }

    static convertirRecordset(record) {
        return new Usuario(
            record.id_usuario,
            record.correo,
            record.nombre,
            record.apellido,
            record.telefono,
            record.fecha_nacimiento,
            record.rol,
            record.id_cliente,
            record.estado
        );
    }

    static async loginUsuario(correo, passEncriptada, pool) {
        const resultado = await pool.request()
            .input('correo', sql.NVarChar, correo)
            .input('password', sql.NVarChar, passEncriptada)
            .query(`
                EXEC loginUsuario
                @correo = @correo,
                @password = @password;
            `);

        if (resultado.recordset.length === 0) {
            return null;
        }

        return Usuario.convertirRecordset(resultado.recordset[0]);
    };
    
    static async desactivar(id_usuario) {
        await pool.request()
            .input('id_usuario', sql.Int, id_usuario)
            .query(`
                EXEC bloquearUsuario
                @id_usuario = @id_usuario;
            `);
    }

     async insertar() {
        const pool = await conectarDB();

        const resultado = await pool.request()
            .input('correo', sql.NVarChar, this.correo)
            .input('nombre', sql.NVarChar, this.nombre)
            .input('apellido', sql.NVarChar, this.apellido)
            .input('telefono', sql.VarChar, this.telefono)
            .input('fecha_nacimiento', sql.Date, this.fecha_nacimiento)
            .input('password', sql.VarChar, this.password)
            .input('id_rol', sql.Int, this.id_rol)
            .input('id_estado', sql.Int, this.id_estado)
            .input('id_cliente', sql.Int, this.id_cliente)
            .query(`
                EXEC insertarUsuario
                @correo = @correo,
                @nombre = @nombre,
                @apellido = @apellido,
                @telefono = @telefono,
                @fecha_nacimiento = @fecha_nacimiento,
                @password = @password,
                @id_rol = @id_rol,
                @id_estado = @id_estado,
                @id_cliente = @id_cliente;
            `);

        return resultado.recordset[0].id_usuario;
    };

     async actualizar() {
        const pool = await conectarDB();

        await pool.request()
            .input('id_usuario', sql.Int, this.id_usuario)
            .input('correo', sql.NVarChar, this.correo)
            .input('nombre', sql.NVarChar, this.nombre)
            .input('apellido', sql.NVarChar, this.apellido)
            .input('telefono', sql.VarChar, this.telefono)
            .input('fecha_nacimiento', sql.this, user.fecha_nacimiento)
            .input('id_rol', sql.Int, this.id_rol)
            .input('id_estado', sql.Int, this.id_estado)
            .input('id_cliente', sql.Int, this.id_cliente)
            .query(`
                EXEC actualizarUsuario
                @id_usuario = @id_usuario,
                @correo = @correo,
                @nombre = @nombre,
                @apellido = @apellido,
                @telefono = @telefono,
                @fecha_nacimiento = @fecha_nacimiento,
                @id_rol = @id_rol,
                @id_estado = @id_estado,
                @id_cliente = @id_cliente;
            `);
    };
}

module.exports = Usuario;
