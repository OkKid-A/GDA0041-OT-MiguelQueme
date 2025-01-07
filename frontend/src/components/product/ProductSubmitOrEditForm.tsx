import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomTextFieldDark from "../layout/CustomTextFieldDark.tsx";
import ProductExpanded from "../../entities/ProductExpanded.ts";
import {
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import api from "../../utils/api.ts";
import { Category } from "../../entities/Category.ts";
import ApiError from "../../contexts/types/ApiError.tsx";
import theme from "../../styles/theme.tsx";
import Button from "@mui/material/Button";
import {useStylesFormSelect} from "../../styles/UseStylesFormSelect.tsx";


export interface ProductSubmitOrEditFormInput {
  nombre: string;
  marca: string;
  codigo: string;
  stock: number;
  precio: number;
  foto?: File | null | undefined;
  id_categoria: number;
  id_estado: number;
}


const productSchema = yup.object().shape({
  nombre: yup
    .string()
    .max(45, "El nombre es demasiado largo.")
    .required("El nombre es requerido."),
  marca: yup
    .string()
    .max(45, "El nombre de la marca es demasiado largo.")
    .required("La marca es requerida."),
  codigo: yup
    .string()
    .max(45, "El codigo es demasiado largo.")
    .required("El codigo es requerido."),
  stock: yup
    .number()
    .integer("El stock debe ser un entero")
    .min(0, "El stock debe ser un entero mayor o 0")
    .required("El stock es requerido."),
  precio: yup
    .number()
    .positive("El precio debe ser un número positivo.")
    .test("isDecimal", "El precio debe tener solo dos decimales", (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{2})?$/.test(String(value));
    })
    .required("El precio es requerido."),
  foto: yup
    .mixed<File>()
    .transform((value) => (value instanceof File ? value : null))
    .nullable()
    .test(
      "fileType",
      "Por favor ingresa una imagen con formato .jpeg, .png o .jpg",
      (value) => {
        if (value === null || value === undefined) return true;
        return (
          typeof value !== "string" &&
          ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
        );
      },
    )
    .test(
      "fileSize",
      "El archivo de la foto es demasiado grando, debe ser de 5 MB",
      (value) => {
        if (value === null || value === undefined) return true;
        return typeof value !== "string" && value.size <= 5 * 1024 * 1024;
      },
    ),
  id_categoria: yup.number().required("La categoria es requerida."),
  id_estado: yup.number().required("El estado es requerido."),
});

interface ProductSubmitOrEditFormProps {
  onSubmit: (data: ProductSubmitOrEditFormInput) => void;
  handleCancel?: () => void;
  product: ProductExpanded | null;
}

const ProductSubmitOrEditForm: React.FC<ProductSubmitOrEditFormProps> = ({
  onSubmit,
  handleCancel: handleCancel,
  product,
}) => {
  const classes = useStylesFormSelect();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProductSubmitOrEditFormInput>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      nombre: product?.nombre,
      marca: product?.marca,
      codigo: product?.codigo,
      stock: product?.stock,
      precio: product?.precio,
      id_categoria: product?.id_categoria,
      id_estado: product?.id_estado,
    },
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [categorie, setCategorie] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleChangeCat = (event: SelectChangeEvent) => {
    setCategorie(event.target.value);
  };

  const handleChangeStatus = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    console.log(file);
    setValue("foto", file ?? null);
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categorias/activas");
      if (response.status === 200) {
        setCategories(response.data as Category[]);
      } else {
        console.error(response.statusText);
      }
    } catch (error) {
      const apiError = error as ApiError;
      console.error(apiError);
    }
  };

  useEffect(() => {
    void fetchCategories();
  }, []);

  useEffect(() => {
    if (product) {
      setValue("id_categoria", product.id_categoria);
      setCategorie(product.id_categoria.toString());
      setValue("id_estado", product.id_estado);
      setStatus(product.id_estado.toString());
    }
  }, [product, setValue]);
// Funcion para renderizar multiples texfields al ingresar un arreglo con los datos

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomTextFieldDark
        label="Nombre del Producto"
        variant="outlined"
        errorMessage={errors.nombre?.message}
        {...register("nombre")}
      />
      <CustomTextFieldDark
        label="Marca"
        variant="outlined"
        errorMessage={errors.marca?.message}
        {...register("marca")}
      />
      <CustomTextFieldDark
        label="Código"
        variant="outlined"
        errorMessage={errors.codigo?.message}
        {...register("codigo")}
      />
      <CustomTextFieldDark
        label="Stock inicial"
        variant="outlined"
        errorMessage={errors.stock?.message}
        {...register("stock")}
      />
      <CustomTextFieldDark
        label="Precio"
        variant="outlined"
        errorMessage={errors.precio?.message}
        {...register("precio")}
      />
      <CustomTextFieldDark
        label="Sube una foto"
        variant="outlined"
        errorMessage={errors.foto?.message}
        placeholder={"foto"}
        type={"file"}
        InputProps={{
          inputProps: {
            accept: "image/*",
          },
        }}
        onChange={handleChangeFile}
      />
      <InputLabel id="categoria" className={classes.inputLabel}>
        Categoria
      </InputLabel>
      <Select
          fullWidth
        variant={"outlined"}
        label="Categoria"
        {...register("id_categoria")}
        onChange={handleChangeCat}
        value={categorie!}
        className={classes.select}
      >
        {categories.map((cat) => {
          return (
            <MenuItem value={cat.id_categoria} key={cat.id_categoria}>
              {cat.nombre}
            </MenuItem>
          );
        })}
      </Select>
      {errors.id_categoria?.message && (
        <FormHelperText error>{errors.id_categoria?.message}</FormHelperText>
      )}
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

export default ProductSubmitOrEditForm;
