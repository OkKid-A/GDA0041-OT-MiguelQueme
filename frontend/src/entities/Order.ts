import {StatusEnum} from "./StatusEnum.ts";

export interface Order {
    id_orden: number;
    nombre: string;
    apellido: string;
    id_estado: StatusEnum;
    fecha_creacion: Date;
    fecha_entrega: Date;
    total_orden: number;
    correo: string;
    telefono: string;
    direccion: string;
    cantidad: number;
    usuarioNombre: string | null;
    usuarioApellido: string | null;
}
