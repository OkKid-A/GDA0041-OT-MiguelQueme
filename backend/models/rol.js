import sequelize from "../config/db.js";
import {DataTypes} from "sequelize";

const Rol = sequelize.define('roles', {
    id_rol: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})

export default Rol;