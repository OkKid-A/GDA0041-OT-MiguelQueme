import React from "react";
import CategoryExpanded from "../../entities/CategoryExpanded.ts";
import CategorySubmitForm, {
  CategorySubmitFormInput,
} from "./CategorySubmitForm.tsx";
import DynamicModal from "../layout/DynamicModal.tsx";
import api from "../../utils/api.ts";
import ApiError from "../../contexts/types/ApiError.tsx";


interface CategoryModalProps {
  open: boolean;
  handleClose: () => void;
  category: CategoryExpanded | null;
  handleResult: (message: string) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  open,
  handleClose,
  category,
  handleResult,
}) => {

  const handleSubmit = async (data: CategorySubmitFormInput): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("nombre", data.nombre);
      formData.append("id_estado", String(data.id_estado));
      if (!category) {
        const response = await api.post("/categorias", formData);
        if (response.status === 200) {
          handleClose();
          handleResult("Categoria creada con éxito");
        }
      } else {
        const response = await api.put(
          `/categorias/${category.id_categoria}`,
          formData,
        );
        if (response.status === 200) {
          handleClose();
          handleResult("Categoría editada con éxito");
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
      title={category ? "Editar categoria" : "Añadir categoria"}
    >
      <CategorySubmitForm
        onSubmit={handleSubmit}
        category={category}
        handleCancel={handleClose}
      />
    </DynamicModal>
  );
};

export default CategoryModal;
