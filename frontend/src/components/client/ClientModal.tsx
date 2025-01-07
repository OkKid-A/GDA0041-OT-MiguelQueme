import React from "react";
import ClientSubmitForm, {
  ClientSubmitFormInput,
} from "./ClientSubmitForm.tsx";
import api from "../../utils/api.ts";
import ApiError from "../../contexts/types/ApiError.tsx";
import DynamicModal from "../layout/DynamicModal.tsx";
import { Client } from "../../entities/Client.ts";

interface ClientModalProps {
  open: boolean;
  handleClose: () => void;
  handleResult: (message: string) => void;
  client: Client | null;
}

const ClientModal: React.FC<ClientModalProps> = ({
  open,
  handleClose,
  handleResult,
  client,
}) => {

  const handleSubmit = async (data: ClientSubmitFormInput): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("razon_social", data.razon_social);
      formData.append("nombre_comercial", data.nombre_comercial);
      formData.append("direccion_entrega", data.direccion_entrega);
      formData.append("correo_empresarial", data.correo_empresarial);
      formData.append("telefono_empresarial", data.telefono_empresarial);
      formData.append("id_estado)", String(data.id_estado));
      if (!client) {
        const response = await api.post("/clientes", formData);
        if (response.status === 200) {
          handleClose();
          handleResult("Cliente creado con éxito");
        }
      } else {
        const response = await api.put(`/clientes/${client.id_cliente}`, formData);
        if (response.status === 200) {
          handleClose();
          handleResult("Cliente Actualizado con éxito");
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
      title={client? "Editar Cliente" : "Añadir Cliente"}
    >
      <ClientSubmitForm
        onSubmit={handleSubmit}
        handleCancel={handleClose}
        client={client}
      />
    </DynamicModal>
  );
};

export default ClientModal;
