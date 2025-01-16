import sql from 'mssql';
import sequelize from '../config/db.js';
import {DataTypes, QueryTypes, Sequelize} from "sequelize";

const Usuario = sequelize.define('usuarios', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fecha_nacimiento: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    id_rol: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'roles',
            key: 'id_rol',
        }
    },
    id_estado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'estados',
            key: 'id_estado',
        }
    },
    id_cliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'clientes',
            key: 'id_cliente',
        }
    }
});

Usuario.insertarUsuario = async function (usuarioBody){

    const result = await sequelize.query(`
        EXEC insertarUsuario
        @correo = :correo,
        @nombre = :nombre,
        @apellido = :apellido,
        @telefono = :telefono,
        @fecha_nacimiento = :fecha_nacimiento,
        @direccion = :direccion,
        @password = :password,
        @id_rol = :id_rol,
        @id_estado = :id_estado,
        @id_cliente = :id_cliente;`,
            {
                replacements: {
                    correo: usuarioBody.correo,
                    nombre: usuarioBody.nombre,
                    apellido: usuarioBody.apellido,
                    telefono: usuarioBody.telefono,
                    fecha_nacimiento: usuarioBody.fecha_nacimiento,
                    direccion: usuarioBody.direccion,
                    password: usuarioBody.password,
                    id_rol: usuarioBody.id_rol,
                    id_estado: usuarioBody.id_estado,
                    id_cliente: usuarioBody.id_cliente,
                },
                type: QueryTypes.SELECT
            }
    );

    return result[0].id_usuario;
};

Usuario.actualizarUsuario = async function (usuarioBody){
    const result = await sequelize.query(`
    EXEC actualizarUsuario
    @id_usuario = :id_usuario,
    @correo = :correo,
    @nombre = :nombre,
    @apellido = :apellido,
    @telefono = :telefono,
    @fecha_nacimiento = :fecha_nacimiento,
    @id_rol = :id_rol,
    @id_estado = :id_estado,
    @id_cliente = :id_cliente,
    @direccion = :direccion;
    `, {
        replacements: {
            id_usuario: usuarioBody.id,
            correo: usuarioBody.correo,
            nombre: usuarioBody.nombre,
            apellido: usuarioBody.apellido,
            telefono: usuarioBody.telefono,
            fecha_nacimiento: usuarioBody.fecha_nacimiento,
            direccion: usuarioBody.direccion,
            id_rol: usuarioBody.id_rol,
            id_estado: usuarioBody.id_estado,
            id_cliente: usuarioBody.id_cliente,
        }
    })
    return result;
};

Usuario.obtenerUsuarios = async function (){
    const result = await sequelize.query(
        'SELECT * FROM seleccionarTodosUsuario;',
        {
            type: QueryTypes.SELECT
        }
    );

    return result;
};

Usuario.loginUsuario = async function (correo, passEncryptada){
    const result = await sequelize.query(`
    EXEC loginUsuario
    @correo = :correo,
    @password = :password;`,
        {
            replacements:{
                correo: correo,
                password: passEncryptada
            },
            type: QueryTypes.SELECT
        }
    );

    if (result.length === 0){
        return null;
    }

    return result[0];
};

Usuario.verificarUnico = async function (correo){
    const result = await Usuario.findAll({
        where: {
            correo: correo,
        }
    })

    return result;
}

Usuario.desactivarUsuarios = async function (id){
    const result = await sequelize.query(`
        EXEC bloquearUsuario
        @id_usuario = :id_usuario;
    `, {
        replacemente: {
            id_usuario: id
        }
    })

    return result;
}

Usuario.activarUsuarios = async function (id){
    const result = await sequelize.query(`
        EXEC desbloquearUsuario
        @id_usuario = :id_usuario;
    `, {
        replacements: {
            id_usuario: id
        }
    })

    return result;
}

/*
    static async desactivarUsuarios(pool,id_usuario) {
        await pool.request()
            .input('id_usuario', sql.Int, id_usuario)
            .execute(`bloquearUsuario`);
    }

    static async activarUsuarios(pool,id_usuario) {
        await pool.request()
            .input('id_usuario', sql.Int, id_usuario)
            .execute(`desbloquearUsuario`);
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
    }

    static async obtenerUsuarios(pool) {
        const resultado = await pool.request().query("SELECT * FROM seleccionarTodosUsuario;");
        return resultado.recordset;
    }

    async actualizarUsuario(pool) {
        await pool.request()
            .input('id_usuario', sql.Int, this.id_usuario)
            .input('correo', sql.NVarChar, this.correo)
            .input('nombre', sql.NVarChar, this.nombre)
            .input('apellido', sql.NVarChar, this.apellido)
            .input('telefono', sql.VarChar, this.telefono)
            .input('fecha_nacimiento', sql.Date, this.fecha_nacimiento)
            .input('id_rol', sql.Int, this.id_rol)
            .input('id_estado', sql.Int, this.id_estado)
            .input('id_cliente', sql.Int, this.id_cliente)
            .execute(`actualizarUsuario`);
    }

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
            record.id_rol,
            record.id_cliente,
            record.id_estado
        );
    }









    async insertarUsuario(password, pool,direccion) {

        const resultado = await pool.request()
            .input('correo', sql.NVarChar, this.correo)
            .input('nombre', sql.NVarChar, this.nombre)
            .input('apellido', sql.NVarChar, this.apellido)
            .input('telefono', sql.VarChar, this.telefono)
            .input('fecha_nacimiento', sql.Date, this.fecha_nacimiento)
            .input('password', sql.VarChar, password)
            .input('id_rol', sql.Int, this.rol)
            .input('id_estado', sql.Int, this.estado)
            .input('id_cliente', sql.Int, this.id_cliente)
            .input('direccion', sql.NVarChar, direccion)
            .execute(`insertarUsuario`);

        return resultado.recordset[0].id_usuario;
    }

    async actualizarUsuario(pool) {
        await pool.request()
            .input('id_usuario', sql.Int, this.id_usuario)
            .input('correo', sql.NVarChar, this.correo)
            .input('nombre', sql.NVarChar, this.nombre)
            .input('apellido', sql.NVarChar, this.apellido)
            .input('telefono', sql.VarChar, this.telefono)
            .input('fecha_nacimiento', sql.Date, this.fecha_nacimiento)
            .input('id_rol', sql.Int, this.id_rol)
            .input('id_estado', sql.Int, this.id_estado)
            .input('id_cliente', sql.Int, this.id_cliente)
            .execute(`actualizarUsuario`);
    }
}
*/
export default Usuario;
