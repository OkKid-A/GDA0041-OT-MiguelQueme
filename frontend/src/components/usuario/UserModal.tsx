import React from "react";
import UserSubmitForm, { UserSubmitFormInput } from "./UserSubmitForm.tsx";
import api from "../../utils/api.ts";
import ApiError from "../../contexts/types/ApiError.tsx";
import DynamicModal from "../layout/DynamicModal.tsx";

interface UserModalProps {
  open: boolean;
  handleClose: () => void;
  handleResult: (message: string) => void;
}

const UserModal: React.FC<UserModalProps> = ({
  open,
  handleClose,
  handleResult,
}) => {
  const handleSubmit = async (data: UserSubmitFormInput):Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("nombre", data.nombre);
      formData.append("apellido", data.apellido);
      formData.append("correo", data.correo);
      formData.append("telefono", data.telefono);
      formData.append("direccion", data.direccion);
      formData.append("fecha_nacimiento", String(data.fecha_nacimiento));
      formData.append("password", data.password);
      formData.append("id_rol)", String(data.id_rol));
      formData.append("id_estado)", String(data.id_estado));
      formData.append("id_cliente)", String(data.id_cliente));
      const response = await api.post("/usuarios", formData);
      if (response.status === 200) {
        handleClose();
        handleResult("Usuario creado con éxito");
      }
    } catch (error) {
      const apiError = error as ApiError;
      console.error(apiError.message);
    }
  }

    return (
      <DynamicModal
        open={open}
        handleClose={handleClose}
        title={"Añadir Usuario"}
      >
        <UserSubmitForm onSubmit={handleSubmit} handleCancel={handleClose} />
      </DynamicModal>
    );
  };

export default UserModal;
