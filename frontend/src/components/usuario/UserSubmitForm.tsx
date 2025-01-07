import * as yup from "yup";
import { checkUnique } from "../../utils/CheckUnique.tsx";
import { differenceInYears } from "date-fns";
import React, { useEffect, useState } from "react";
import { useStylesFormSelect } from "../../styles/UseStylesFormSelect.tsx";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    Box, FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    SelectChangeEvent,
} from "@mui/material";
import Select from "@mui/material/Select";
import { Client } from "../../entities/Client.ts";
import api from "../../utils/api.ts";
import ApiError from "../../contexts/types/ApiError.tsx";
import CustomTextFieldDark from "../layout/CustomTextFieldDark.tsx";
import { StatusEnum } from "../../entities/StatusEnum.ts";
import theme from "../../styles/theme.tsx";
import Button from "@mui/material/Button";

export interface UserSubmitFormInput {
  correo: string;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  fecha_nacimiento: Date;
  password: string;
  id_rol: number;
  id_estado: number;
  id_cliente?: number | null;
}

const userSchema = yup.object().shape({
  correo: yup
    .string()
    .required("El correo es obligatorio.")
    .email("Por favor ingresa un correo válido.")
    .max(128, "Tu correo debe tener menos de 128 caracteres.")
    .test(
      "isUnique",
      "Este correo ya esta registrado.",
      async function (value) {
        if (!value) return true;
        return await checkUnique( value);
      },
    ),
  nombre: yup
    .string()
    .max(45, "Tu nombre debe tener menos de 45 caracteres.")
    .required("El nombre es obligatorio."),
  apellido: yup
    .string()
    .max(45, "Tu apellido debe tener menos de 45 caracteres.")
    .required("El apellido es obligatorio."),
  telefono: yup
    .string()
    .matches(/^\d{8}$/, "El numero de telefono debe tener 8 digitos.")
    .required("El teléfono es obligatorio."),
  direccion: yup
    .string()
    .max(128, "Tu direccion debe tener menos de 128 caracteres")
    .required("La direccion es obligatoria."),
  fecha_nacimiento: yup
    .date()
    .required("La fecha de nacimiento es obligatoria")
    .test("esAdulto", "Debes tener más de 18 años.", function (value) {
      if (!value) return true;
      return differenceInYears(new Date(), value) >= 18;
    }),
  password: yup
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .max(64, "La contraseña debe tener menos de 64 caracteres.")
    .required("La contraseña es obligatoria."),
  id_rol: yup.number().required("El rol es obligatorio."),
  id_estado: yup.number().required("El estado es obligatorio."),
  id_cliente: yup.number().nullable(),
});

interface UserSubmitFormProps {
  onSubmit: (data: UserSubmitFormInput) => void;
  handleCancel?: () => void;
}

const UserSubmitForm: React.FC<UserSubmitFormProps> = ({
  onSubmit,
  handleCancel,
}) => {
  const classes = useStylesFormSelect();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSubmitFormInput>({
    resolver: yupResolver(userSchema),
  });
  const [clients, setClients] = useState<Client[] | null>(null);
  const [client, setClient] = useState<string | null>(null);

  const handleChangeClient = (event: SelectChangeEvent) => {
    setClient(event.target.value);
  };

  const fetchClients = async () => {
    try {
      const response = await api.get("/clientes/");
      if (response.status === 200) {
        setClients(response.data as Client[]);
      } else {
        console.error(response.statusText);
      }
    } catch (error) {
      const apiError = error as ApiError;
      console.error(apiError);
    }
  };

  useEffect(() => {
    void fetchClients();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{display: "flex", justifyContent: "space-between"}}>
        <CustomTextFieldDark
          label="Nombre"
          variant="outlined"
          errorMessage={errors.nombre?.message}
          {...register("nombre")}
        />
        <CustomTextFieldDark
          label="Apellido"
          variant="outlined"
          errorMessage={errors.apellido?.message}
          {...register("apellido")}
        />
      </Box>
      <CustomTextFieldDark
          type={"password"}
        label="Contraseña"
        variant="outlined"
        errorMessage={errors.password?.message}
        {...register("password")}
      />
      <CustomTextFieldDark
        label="Correo"
        variant="outlined"
        errorMessage={errors.correo?.message}
        {...register("correo")}
      />
      <CustomTextFieldDark
        label="Telefono"
        variant="outlined"
        errorMessage={errors.telefono?.message}
        {...register("telefono")}
      />
      <CustomTextFieldDark
        label="Direccion"
        variant="outlined"
        errorMessage={errors.direccion?.message}
        {...register("direccion")}
      />
      <CustomTextFieldDark
          type="date"
        label="Fecha de Nacimiento"
        variant="outlined"
        errorMessage={errors.fecha_nacimiento?.message}
        {...register("fecha_nacimiento")}
      />
      <InputLabel id="categoria" className={classes.inputLabel}>
        Cliente
      </InputLabel>
      <Select
        fullWidth
        variant={"outlined"}
        label="Categoria"
        {...register("id_cliente")}
        onChange={handleChangeClient}
        value={client!}
        className={classes.select}
      >
        {clients?.map((cat) => {
          if (cat.id_estado === StatusEnum.ACTIVE) {
            return (
              <MenuItem value={cat.id_cliente} key={cat.id_cliente}>
                {cat.nombre_comercial}
              </MenuItem>
            );
          }
        })}

      </Select>
      {errors.id_cliente?.message && (
        <FormHelperText error>{errors.id_cliente?.message}</FormHelperText>
      )}
        <Box sx={{justifyContent: "space-between"}}>
            <FormControl fullWidth>
                <InputLabel id="estado-label" sx={{ color: theme.palette.text.primary }}>
                    Rol
                </InputLabel>
                <Select
                    fullWidth
                    label="Estado inicial"
                    labelId="estado-label"
                    id="estado"
                    variant={"outlined"}
                    className={classes.select}
                    {...register("id_rol")}
                >
                    <MenuItem value="1">Operador</MenuItem>
                    <MenuItem value="2">Usuario</MenuItem>
                </Select>
                {errors.id_rol?.message && (
                    <FormHelperText error>{errors.id_rol?.message}</FormHelperText>
                )}
            </FormControl>

      <InputLabel id="estado-label" sx={{ color: theme.palette.text.primary }}>
        Estado inicial
      </InputLabel>
      <Select
        fullWidth
        label="Estado inicial"
        labelId="estado-label"
        variant={"outlined"}
        className={classes.select}
        {...register("id_estado")}
      >
        <MenuItem value="1">Activo</MenuItem>
        <MenuItem value="2">Inactivo</MenuItem>
        <MenuItem value="3">Pendiente</MenuItem>
      </Select>
      {errors.id_estado?.message && (
        <FormHelperText error>{errors.id_estado?.message}</FormHelperText>
      )}
        </Box>
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

export default UserSubmitForm;
