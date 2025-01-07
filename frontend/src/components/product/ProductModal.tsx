import ProductExpanded from "../../entities/ProductExpanded.ts";
import ProductSubmitForm, {
  ProductSubmitOrEditFormInput,
} from "./ProductSubmitForm.tsx";
import ApiError from "../../contexts/types/ApiError.tsx";
import React from "react";
import apiFiles from "../../utils/apiFiles.ts";
import DynamicModal from "../layout/DynamicModal.tsx";

interface ProductModalProps {
  open: boolean;
  handleClose: () => void;
  product: ProductExpanded | null;
  handleResult : (message: string) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  open,
  handleClose,
  product,
    handleResult
}) => {

  const handleSubmit = async (
    data: ProductSubmitOrEditFormInput,
  ): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("nombre", data.nombre);
      formData.append("marca", data.marca);
      formData.append("codigo", data.codigo);
      formData.append("stock", String(data.stock));
      formData.append("precio", String(data.precio));
      formData.append("id_categoria", String(data.id_categoria));
      formData.append("id_estado",String(data.id_estado));
      if(data.foto instanceof File){
        console.log(data.foto instanceof File);
        formData.append("foto", data.foto);
      }
      if (!product) {
        const response = await apiFiles.post("/productos", formData);
        if(response.status === 200) {
          handleClose();
          handleResult("Producto creado con exito");
        }
      } else {
        const response = await apiFiles.put(`/productos/${product.id_producto}`, formData);
        if(response.status === 200) {
          handleClose();
          handleResult("Producto editado con exito");
        }
      }
    } catch (error) {
      const apiError = error as ApiError;
      console.error(apiError.message);
    }
  };

  return (
      <DynamicModal
      open={open}
      handleClose={handleClose}
      title={product ? "Editar producto" : "Añadir producto"}>

            <ProductSubmitForm
              onSubmit={handleSubmit}
              product={product}
              handleCancel={handleClose}
            />

</DynamicModal>

);
};

export default ProductModal;
