import {StatusEnum} from "./StatusEnum.ts";

export interface Client {
    id_cliente: number,
    razon_social: string,
    nombre_comercial: string,
    direccion_entrega: string,
    correo_empresarial: string,
    telefono_empresarial: string,
    id_estado: StatusEnum,
}