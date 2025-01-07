import React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomTextFieldDark from "../layout/CustomTextFieldDark.tsx";
import theme from "../../styles/theme.tsx";
import Button from "@mui/material/Button";

export interface userOrderFormInput {
  calle: string;
  numero: string;
  municipio: string;
  departamento: string;
  codigoPostal: string;
}

const userOrderSchema = yup.object().shape({
  calle: yup
    .string()
    .max(25, "El nombre es demasiado largo.")
    .required("La calle es requerida"),
  numero: yup
    .string()
    .min(4, "El numero de casa es invalido.")
    .matches(
      /^[A-Z]?[0-9]{2}-[0-9]{2}$/,
      "El formato del numero no es el adecuado, ejemplo A19-45.",
    )
    .required("El numero de casa es requerido."),
  municipio: yup
    .string()
    .max(50, "El nombre del municipio debe tener menos de 50 caracteres.")
    .required("El nombre del municipio es requerido."),
  departamento: yup
    .string()
    .max(50, "El nombre del departamento debe tener menos de 50 caracteres.")
    .required("El nombre del departamento es requerido."),
  codigoPostal: yup
    .string()
    .matches(/^[0-9]{5}$/, "Un numero postal debe tener 5 numeros.")
    .required("El numero postal es requerido."),
});

interface UserOrderFormProps {
  onSubmit: (data: userOrderFormInput) => void;
  handleCancelar: () => void;
}

const UserOrderForm: React.FC<UserOrderFormProps> = ({
  onSubmit,
  handleCancelar,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<userOrderFormInput>({
    resolver: yupResolver(userOrderSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomTextFieldDark
        label="Número de calle"
        variant="outlined"
        errorMessage={errors.calle?.message}
        {...register("calle")}
      />
      <CustomTextFieldDark
        {...register("numero")}
        label="Número de casa"
        variant="outlined"
        errorMessage={errors.numero?.message}
      />
      <CustomTextFieldDark
        {...register("municipio")}
        label="Municipio"
        variant="outlined"
        errorMessage={errors.municipio?.message}
      />
      <CustomTextFieldDark
        {...register("departamento")}
        label="Departamento"
        variant="outlined"
        errorMessage={errors.departamento?.message}
      />
      <CustomTextFieldDark
        {...register("codigoPostal")}
        label="Código postal"
        variant="outlined"
        type={"number"}
        errorMessage={errors.codigoPostal?.message}
      />
      <div style={{ paddingTop: theme.spacing(5) }}>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          style={{ color: theme.palette.text.secondary }}
        >
          Confirmar Orden
        </Button>
        <Button
          variant="contained"
          fullWidth
          onClick={handleCancelar}
          sx={{ backgroundColor: theme.palette.error.main }}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default UserOrderForm;
