import React, { useState } from "react";
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
import { makeStyles } from "@mui/styles";
import { Order } from "../../entities/Order.ts";
import { StatusEnum } from "../../entities/StatusEnum.ts";
import { CheckBox, Info, RemoveCircle } from "@mui/icons-material";
import theme from "../../styles/theme.tsx";
import OrderHistoryModal from "./OrderHistoryModal.tsx";
import Button from "@mui/material/Button";
import api from "../../utils/api.ts";
import ApiError from "../../contexts/types/ApiError.tsx";

const useStyles = makeStyles<Theme>((theme: Theme) => ({
  tableContainer: {
    maxWidth: "90%",
    margin: theme.spacing(2, "auto"),
  },
}));

interface OrderHistoryTableProps {
  orders: Order[];
  isOperator: boolean; // Para no crear componentes innecesarios reutilizaremos esta tabla para el operador
}

const OrderHistoryTable: React.FC<OrderHistoryTableProps> = ({
  orders,
  isOperator,
}) => {
  const classes = useStyles();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [focusedOrder, setfocusedOrder] = useState<Order | null>(null);

  const handleOpen = (order: Order) => {
    setfocusedOrder(order);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setfocusedOrder(null);
  };

  const handleDelivery = async (id: number) => {
    const id_estado = StatusEnum.ACTIVE;
    if (id) {
      try {
        const response = await api.put(`/ordenes/${id}`, {
          id_estado: id_estado,
        });
        if (response.status === 200) {
          setMessage("Se ha entregado la orden con éxito");
        } else {
          setError("Error al intentar entregar la orden");
        }
      } catch (error) {
        const apiError = error as ApiError;
        setError(apiError.message);
      }
    }
  };

  const handleRejection = async (id: number) => {
    const id_estado = StatusEnum.REJECTED;
    if (id) {
      try {
        const response = await api.put(`/ordenes/${id}`, {
          id_estado: id_estado,
        });
        if (response.status === 200) {
          setMessage("Se ha rechazado la orden con éxito");
        } else {
          setError("Error al intentar rechazar la orden");
        }
      } catch (error) {
        const apiError = error as ApiError;
        setError(apiError.message);
      }
    }
  };

  const traducirEstado = (id_estado: StatusEnum) => {
    switch (id_estado) {
      case StatusEnum.ACTIVE:
        return "Entregada";
      case StatusEnum.PENDING:
        return "Pendiente";
      default:
        return "Error";
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("es-MX");
  };

  const formatOrders = (orders: Order[]) => {
    if (isOperator) {
      return orders;
    } else {
      return orders.filter((order) => order.id_estado !== StatusEnum.INACTIVE);
    }
  };

  return (
    <TableContainer
      component={Paper}
      elevation={3}
      className={classes.tableContainer}
    >
      <Snackbar
        open={!!message}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success">{message}</Alert>
      </Snackbar>
      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="right">Fecha de creación</TableCell>
            <TableCell align="right">Fecha de entrega</TableCell>
            <TableCell align="center">Direccion de entrega</TableCell>
            {isOperator && (
              <TableCell align="right">Nombre de Usuario</TableCell>
            )}
            <TableCell align="right">Nombre en factura</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">Estado</TableCell>
            <TableCell align="right">No. productos</TableCell>
            <TableCell align="center">Detalles</TableCell>
            {isOperator && <TableCell align="right">Entregar</TableCell>}
            {isOperator && <TableCell align="right">Rechazar</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {formatOrders(orders).map((order) => (
            <TableRow
              key={order.id_orden}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{order.id_orden}</TableCell>
              <TableCell align="right">
                {formatDate(order.fecha_creacion.toString())}
              </TableCell>
              <TableCell align="right">
                {order.id_estado === StatusEnum.ACTIVE
                  ? formatDate(order.fecha_entrega.toString())
                  : "Pendiente"}
              </TableCell>
              <TableCell align="center">{order.direccion}</TableCell>
              {isOperator && (
                <TableCell align="center">
                  ${order.usuarioNombre} ${order.usuarioApellido}
                </TableCell>
              )}
              <TableCell align="center">{order.direccion}</TableCell>
              <TableCell align="right">
                {order.nombre + " " + order.apellido}
              </TableCell>
              <TableCell align="right">
                Q{order.total_orden.toFixed(2)}
              </TableCell>
              <TableCell align="right">
                {traducirEstado(order.id_estado)}
              </TableCell>
              <TableCell align="right">{order.cantidad}</TableCell>
              <TableCell align="center">
                <Button
                  variant="outlined"
                  sx={{
                    color: theme.palette.primary.light,
                    "&.Mui-disabled": {
                      color: theme.palette.info.dark,
                    },
                  }}
                  onClick={() => handleOpen(order)}
                >
                  <Info /> Ver Detalles
                </Button>
              </TableCell>
              {isOperator && (
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    disabled={order.id_estado !== StatusEnum.PENDING}
                    sx={{
                      color: theme.palette.primary.light,
                      "&.Mui-disabled": {
                        color: theme.palette.info.dark,
                      },
                    }}
                    onClick={() => handleDelivery(order.id_orden)}
                  >
                    <CheckBox /> Entregar
                  </Button>
                </TableCell>
              )}
              {isOperator && (
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    disabled={order.id_estado !== StatusEnum.PENDING}
                    sx={{
                      color: theme.palette.primary.light,
                      "&.Mui-disabled": {
                        color: theme.palette.info.dark,
                      },
                    }}
                    onClick={() => handleRejection(order.id_orden)}
                  >
                    <RemoveCircle /> Rechazar
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <OrderHistoryModal
        open={openModal}
        handleClose={handleClose}
        order={focusedOrder}
      />
    </TableContainer>
  );
};

export default OrderHistoryTable;
