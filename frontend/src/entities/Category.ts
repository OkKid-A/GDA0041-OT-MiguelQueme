import {StatusEnum} from "./StatusEnum.ts";

export interface Category {
    id_categoria:number;
    nombre: string;
    fecha_creacion: Date;
    id_estado : StatusEnum;
    id_usuario: number;
}