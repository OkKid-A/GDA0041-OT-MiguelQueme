import {StatusEnum} from "./StatusEnum.ts";
import {Roles} from "./RolesEnum.ts";
import User from "./User.ts";

export interface UserOperator{
    id_usuario: number;
    id_estado: StatusEnum;
    id_cliente: number;
    id_rol: Roles;
    direccion: string;
    fecha_creacion: Date;
}

type UserExpanded = User & UserOperator;

export  default UserExpanded;