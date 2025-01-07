import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { useStylesFormSelect } from "../../styles/UseStylesFormSelect.tsx";
import { Client } from "../../entities/Client.ts";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import CustomTextFieldDark from "../layout/CustomTextFieldDark.tsx";
import theme from "../../styles/theme.tsx";
import Button from "@mui/material/Button";

export interface ClientSubmitFormInput {
  razon_social: string;
  nombre_comercial: string;
  direccion_entrega: string;
  correo_empresarial: string;
  telefono_empresarial: string;
  id_estado: number;
}

const clientSchema = yup.object().shape({
  razon_social: yup
    .string()
    .required("La razon social es obligatoria.")
    .max(256, "Debe tener menos de 256 caracteres."),
  nombre_comercial: yup
    .string()
    .required("El nombre comercial es obligatorio.")
    .max(45, "Debe tener menos de 45 caracteres."),
  direccion_entrega: yup
    .string()
    .required("El direccion de entrega es obligatoria.")
    .max(45, "Debe tener menos de 45 caracteres."),
  correo_empresarial: yup
    .string()
    .email("Por favor ingresa un correo válido.")
    .max(128, "Tu correo debe tener menos de 128 caracteres.")
    .required("Tu correo es obligatorio."),
  telefono_empresarial: yup
    .string()
    .matches(/^\d{8}$/, "El numero de telefono debe tener 8 digitos.")
    .required("El teléfono es obligatorio."),
  id_estado: yup.number().required("El estado es obligatorio."),
});

interface ClientSubmitFormProps {
  onSubmit: (data: ClientSubmitFormInput) => void;
  handleCancel?: () => void;
  client: Client | null;
}

const ClientSubmitForm: React.FC<ClientSubmitFormProps> = ({
  onSubmit,
  handleCancel,
  client,
}) => {
  const classes = useStylesFormSelect();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ClientSubmitFormInput>({
    resolver: yupResolver(clientSchema),
    defaultValues: {
      nombre_comercial: client?.nombre_comercial,
      razon_social: client?.razon_social,
      direccion_entrega: client?.direccion_entrega,
      correo_empresarial: client?.correo_empresarial,
      telefono_empresarial: client?.telefono_empresarial,
      id_estado: client?.id_estado,
    },
  });
  const [status, setStatus] = useState<string | null>(null);

  const handleChangeStatus = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  useEffect(() => {
    if (client) {
      setValue("id_estado", client.id_estado);
      setStatus(client.id_estado.toString());
    }
  }, [client, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomTextFieldDark
        label="Nombre comercial"
        variant="outlined"
        errorMessage={errors.nombre_comercial?.message}
        {...register("nombre_comercial")}
      />
      <CustomTextFieldDark
        label="Razón social"
        variant="outlined"
        errorMessage={errors.razon_social?.message}
        {...register("razon_social")}
      />
      <CustomTextFieldDark
        label="Correo empresarial"
        variant="outlined"
        errorMessage={errors.correo_empresarial?.message}
        {...register("correo_empresarial")}
      />
      <CustomTextFieldDark
        label="Telefono empresarial"
        variant="outlined"
        errorMessage={errors.telefono_empresarial?.message}
        {...register("telefono_empresarial")}
      />
      <CustomTextFieldDark
        label="Direccion de entrega"
        variant="outlined"
        errorMessage={errors.direccion_entrega?.message}
        {...register("direccion_entrega")}
      />
      <FormControl fullWidth>
        <InputLabel
          id="estado-label"
          sx={{ color: theme.palette.text.primary }}
        >
          Estado inicial
        </InputLabel>
        <Select
          fullWidth
          {...register("id_estado")}
          label="Estado inicial"
          labelId="estado-label"
          variant={"outlined"}
          onChange={handleChangeStatus}
          value={status!}
          className={classes.select}
        >
          <MenuItem value="1">Activo</MenuItem>
          <MenuItem value="2">Inactivo</MenuItem>
        </Select>
        {errors.id_estado?.message && (
          <FormHelperText error>{errors.id_estado?.message}</FormHelperText>
        )}
      </FormControl>
      <div style={{ paddingTop: theme.spacing(5), display: "flex" }}>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          style={{ color: theme.palette.text.secondary }}
        >
          Guardar Cambios
        </Button>
        <Button
          variant="contained"
          fullWidth
          onClick={handleCancel}
          sx={{ backgroundColor: theme.palette.error.main }}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default ClientSubmitForm;
