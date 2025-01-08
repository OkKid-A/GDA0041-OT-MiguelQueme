
interface ProductDetail {
    id_detalle: number | null;
    id_producto: number;
    cantidad: number;
    precio: number;
    subtotal: number | null;
    nombre: string;
    marca: string;
    codigo: string;
    foto: string;
}

export default ProductDetail;