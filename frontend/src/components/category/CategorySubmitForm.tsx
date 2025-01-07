import * as yup from "yup";
import CategoryExpanded from "../../entities/CategoryExpanded.ts";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import CustomTextFieldDark from "../layout/CustomTextFieldDark.tsx";
import { useStylesFormSelect } from "../../styles/UseStylesFormSelect.tsx";
import theme from "../../styles/theme.tsx";
import Button from "@mui/material/Button";

export interface CategorySubmitFormInput {
  nombre: string;
  id_estado: number;
}

const categorySchema = yup.object().shape({
  nombre: yup
    .string()
    .max(45, "El nombre de la categoría es demasiado largo.")
    .required("El nombre de la categoría es requerido."),
  id_estado: yup.number().required("El estado es requerido."),
});

interface CategorySubmitFormProps {
  onSubmit: (data: CategorySubmitFormInput) => void;
  handleCancel?: () => void;
  category: CategoryExpanded | null;
}

const CategorySubmitForm: React.FC<CategorySubmitFormProps> = ({
  onSubmit,
   handleCancel,
  category,
}) => {
  const classes = useStylesFormSelect();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CategorySubmitFormInput>({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      nombre: category?.nombre,
      id_estado: category?.id_estado,
    },
  });
  const [status, setStatus] = useState<string | null>(null);

  const handleChangeStatus = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  useEffect(() => {
    if (category) {
      setValue("id_estado", category.id_estado);
      setStatus(category.id_estado.toString());
    }
  }, [category, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomTextFieldDark
        label="Nombre de la Categoria"
        variant="outlined"
        errorMessage={errors.nombre?.message}
        {...register("nombre")}
      />
      <InputLabel id="estado-label" sx={{ color: theme.palette.text.primary }}>
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

export default CategorySubmitForm;
