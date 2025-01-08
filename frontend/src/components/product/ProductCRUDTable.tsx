import React, { useState } from "react";
import {
  Alert,
  Avatar,
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
import theme from "../../styles/theme.tsx";
import { StatusEnum } from "../../entities/StatusEnum.ts";
import Button from "@mui/material/Button";
import { Edit, RemoveCircle } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import ProductExpanded from "../../entities/ProductExpanded.ts";
import { formatDate } from "../../utils/functions/formatDate.ts";
import api from "../../utils/api.ts";
import ApiError from "../../contexts/types/ApiError.tsx";
import ProductModal from "./ProductModal.tsx";

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
      backgroundColor: `${theme.palette.primary.main} !important`
    },
  tableHeaderCell: {
    backgroundColor: `${theme.palette.primary.main} !important`,
    color: `${theme.palette.text.secondary} !important`,
    fontWeight: "bold !important"
  }
}));

interface ProductCRUDTableProps {
  products: ProductExpanded[];
  onUpdate: () => void;
}

const ProductCRUDTable: React.FC<ProductCRUDTableProps> = ({
  products,
  onUpdate,
}) => {
  const classes = useStyles();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [focusedProduct, setfocusedProduct] = useState<ProductExpanded | null>(
    null,
  );

  const handleOnClose = () => {
    setError(null);
    setMessage(null);
  };

  const handleClose = () => {
    setOpenModal(false);
    setfocusedProduct(null);
  };

  const handleResultMessage = (message: string) => {
    onUpdate();
    setMessage((message));
  }

  const handleDeactivate = async (id: number) => {
    if (id) {
      try {
        const response = await api.delete(`/productos/${id}`);
        if (response.status === 200) {
          onUpdate();
          setMessage("Orden desactivada con exito");
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

  const handleEdit = (product: ProductExpanded) => {
    setfocusedProduct(product);
    setOpenModal(true);
  };

  return (
    <TableContainer
      component={Paper}
      elevation={3}
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
      <Table stickyHeader={true}>
        <TableHead >
          <TableRow >
            <TableCell
              className={classes.tableHeaderCell}
            >
              ID
            </TableCell>
            <TableCell
              className={classes.tableHeaderCell}
              align="right"
            >
              Nombre
            </TableCell>
            <TableCell
              className={classes.tableHeaderCell}
              align="right"
            >
              Marca
            </TableCell>
            <TableCell
              className={classes.tableHeaderCell}
              align="center"
            >
              Código
            </TableCell>
            <TableCell
              className={classes.tableHeaderCell}
              align="right"
            >
              Stock Actual
            </TableCell>
            <TableCell
              className={classes.tableHeaderCell}
              align="right"
            >
              Precio
            </TableCell>
            <TableCell
              className={classes.tableHeaderCell}
              align="right"
            >
              Fecha de creación
            </TableCell>
            <TableCell
              className={classes.tableHeaderCell}
              align="right"
            >
              Foto
            </TableCell>
            <TableCell
              className={classes.tableHeaderCell}
              align="right"
            >
              Categoría
            </TableCell>
            <TableCell
              className={classes.tableHeaderCell}
              align="center"
            >
              Usuario creador
            </TableCell>
            <TableCell
              className={classes.tableHeaderCell}
              align="center"
            >
              Estado
            </TableCell>
            <TableCell
              className={classes.tableHeaderCell}
              align="center"
            >
              Editar
            </TableCell>
            <TableCell
              className={classes.tableHeaderCell}
              align="center"
            >
              Eliminar
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow
              key={product.id_producto}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{product.id_producto}</TableCell>
              <TableCell align="right">{product.nombre}</TableCell>
              <TableCell align="right">{product.marca}</TableCell>
              <TableCell align="right">{product.codigo}</TableCell>
              <TableCell align="center">{product.stock}</TableCell>
              <TableCell align="center">Q{product.precio}</TableCell>
              <TableCell align="right">
                {formatDate(product.fecha_creacion)}
              </TableCell>
              <TableCell align="right">
                <Avatar
                  src={product.foto}
                  alt={product.nombre}
                  variant={"rounded"}
                  className={classes.avatar}
                />
              </TableCell>
              <TableCell align="right">{product.categoria}</TableCell>
              <TableCell align="right">
                {product.usuarioNombre} {product.usuarioApellido}
              </TableCell>
              <TableCell align="right">{product.estado}</TableCell>
              <TableCell align="center">
                <Button
                  variant="outlined"
                  disabled={product.id_estado === StatusEnum.INACTIVE}
                  sx={{
                    color: theme.palette.primary.light,
                    "&.Mui-disabled": {
                      color: theme.palette.info.dark,
                    },
                  }}
                  onClick={() => handleEdit(product)}
                >
                  <Edit /> Editar
                </Button>
              </TableCell>
              <TableCell align="center">
                <Button
                  variant="outlined"
                  disabled={product.id_estado === StatusEnum.INACTIVE}
                  sx={{
                    color: theme.palette.error.light,
                    "&.Mui-disabled": {
                      color: theme.palette.info.dark,
                    },
                  }}
                  onClick={() => handleDeactivate(product.id_producto)}
                >
                  <RemoveCircle /> Desactivar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ProductModal open={openModal} handleClose={handleClose} product={focusedProduct} handleResult={handleResultMessage}/>
    </TableContainer>
  );
};

export default ProductCRUDTable;
