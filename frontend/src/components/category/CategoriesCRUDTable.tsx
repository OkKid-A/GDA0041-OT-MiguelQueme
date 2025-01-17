import React, { useState } from "react";
import CategoryExpanded from "../../entities/CategoryExpanded.ts";
import { makeStyles } from "@mui/styles";
import {
  Alert,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
} from "@mui/material";
import api from "../../utils/api.ts";
import ApiError from "../../contexts/types/ApiError.tsx";
import {
  RenderTableHeaderCell,
  TableHeader,
} from "../../utils/render/RenderTableHeader.tsx";
import { formatDate } from "../../utils/functions/formatDate.ts";
import Button from "@mui/material/Button";
import { StatusEnum } from "../../entities/StatusEnum.ts";
import theme from "../../styles/theme.tsx";
import { Edit, RemoveCircle } from "@mui/icons-material";
import CategoryModal from "./CategoryModal.tsx";

const useStyles = makeStyles<Theme>((theme: Theme) => ({
  tableContainer: {
    maxWidth: "90%",
    maxHeight: 800,
    margin: theme.spacing(2, "auto"),
    borderRadius: 5,
  },
  tableHeader: {
    color: theme.palette.text.secondary,
    flexGrow: 2,
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  tableHeaderCell: {
    backgroundColor: `${theme.palette.primary.main} !important`,
    color: `${theme.palette.text.secondary} !important`,
    fontWeight: "bold !important",
  },
}));

const tableHeaders: TableHeader[] = [
  { label: "ID", align: "left" },
  { label: "Nombre", align: "center" },
  { label: "Fecha de creación", align: "right" },
  { label: "Usuario creador", align: "center" },
  { label: "Estado", align: "center" },
  { label: "Editar", align: "center" },
  { label: "Eliminar", align: "center" },
];

interface CategoriesCRUDTableProps {
  categories: CategoryExpanded[];
  onUpdate: () => void;
}

const CategoriesCRUDTable: React.FC<CategoriesCRUDTableProps> = ({
  categories,
  onUpdate,
}) => {
  const classes = useStyles();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [focusedCategory, setfocusedCategory] =
    useState<CategoryExpanded | null>(null);

  const handleOnClose = () => {
    setError(null);
    setMessage(null);
  };

  const handleClose = () => {
    setOpenModal(false);
    setfocusedCategory(null);
  };

  const handleResultMessage = (message: string) => {
    onUpdate();
    setMessage(message);
  };

  const handleEdit = (category: CategoryExpanded) => {
    setfocusedCategory(category);
    setOpenModal(true);
  };

  const handleDeactivate = async (id: number) => {
    if (id) {
      try {
        const response = await api.delete(`/categorias/${id}`);
        if (response.status === 200) {
          onUpdate();
          setMessage("Categoria desactivada con exito");
        } else {
          setError(
            "Error al intentar desactivar el producto: " + response.statusText,
          );
        }
      } catch (error) {
        const apiError = error as ApiError;
        setError(apiError.message);
      }
    }
  };

  return (
    <TableContainer
      component={Paper}
      elevation={5}
      className={classes.tableContainer}
    >
      <Snackbar
        open={!!message}
        onClose={handleOnClose}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success">{message}</Alert>
      </Snackbar>
      <Snackbar
        open={!!error}
        onClose={handleOnClose}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <RenderTableHeaderCell cells={tableHeaders} />
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((category) => (
            <TableRow
              key={category.id_categoria}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{category.id_categoria}</TableCell>
              <TableCell align="center">{category.nombre}</TableCell>
              <TableCell align="right">
                {formatDate(category.fecha_creacion)}
              </TableCell>
              <TableCell align="center">
                {category.usuarioNombre} {category.usuarioApellido}
              </TableCell>
              <TableCell align="center">{category.estado}</TableCell>
              <TableCell align="center">
                <Button
                  variant="outlined"
                  sx={{
                    color: theme.palette.primary.light,
                    "&.Mui-disabled": {
                      color: theme.palette.info.dark,
                    },
                  }}
                  onClick={() => handleEdit(category)}
                >
                  <Edit /> Editar
                </Button>
              </TableCell>
              <TableCell align="center">
                <Button
                  variant="outlined"
                  disabled={category.id_estado === StatusEnum.INACTIVE}
                  sx={{
                    color: theme.palette.error.light,
                    "&.Mui-disabled": {
                      color: theme.palette.info.dark,
                    },
                  }}
                  onClick={() => handleDeactivate(category.id_categoria)}
                >
                  <RemoveCircle /> Desactivar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CategoryModal open={openModal} handleClose={handleClose} category={focusedCategory} handleResult={handleResultMessage}/>
    </TableContainer>
  );
};

export default CategoriesCRUDTable;
