import Product from "./Product";
import { StatusEnum } from "./StatusEnum.ts";

export interface ProductOperator {
  usuarioNombre: string;
  usuarioApellido: string;
  fecha_creacion: Date;
  id_estado: StatusEnum;
  id_categoria: number;
}

type ProductExpanded = Product & ProductOperator;

export default ProductExpanded;
