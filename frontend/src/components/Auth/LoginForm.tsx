import React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import CustomTextFieldDark from "../Layout/CustomTextFieldDark.tsx";
import theme from "../../styles/theme.tsx";

// Declaramos el contenido de la form del login
export interface loginFormInput {
  correo: string;
  password: string;
}

// Insertamos las validaciones de los campos de nuestra form
const loginSchema = yup.object().shape({
  correo: yup
    .string()
    .email("Por favor inserta un correo valido.")
    .required("Por favor inserta tu correo electrónico"),
  password: yup
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .required("Por favor inserta tu " + "contraseña"),
});

const LoginForm: React.FC<{
  onSubmit: (data: loginFormInput) => Promise<void>;
}> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormInput>({
    resolver: yupResolver(loginSchema),
  });

    return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomTextFieldDark
        label="Correo electrónico"
        variant="outlined"
        errorMessage={errors.correo?.message}
        {...register("correo")}
      />
      <CustomTextFieldDark
        {...register("password")}
        label="Contraseña"
        variant="outlined"
        type="password"
        errorMessage={errors.password?.message}
      />
      <div style={{ paddingTop: theme.spacing(5) }}>
        <Button type="submit" variant="contained" fullWidth style={{ color: theme.palette.text.secondary }}>
          Iniciar Sesión
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
