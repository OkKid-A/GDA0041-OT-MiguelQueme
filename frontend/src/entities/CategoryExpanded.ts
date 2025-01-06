import { Category } from "./Category.ts";

export interface CategoryOperator {
    usuarioNombre: string;
    usuarioApellido: string;
    estado: string;
}

type CategoryExpanded = CategoryOperator & Category;

export default CategoryExpanded;
