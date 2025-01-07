import {Alert, Box, Snackbar, Theme, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {useEffect, useState} from "react";
import {Order} from "../../entities/Order.ts";
import api from "../../utils/api.ts";
import ApiError from "../../contexts/types/ApiError.tsx";
import OrderHistoryTable from "../../components/order/OrderHistoryTable.tsx";
import theme from "../../styles/theme.tsx";
import DynamicModal from "../../components/layout/DynamicModal.tsx";
import useActionsPage from "../../hooks/useActionsPage.ts";
import Button from "@mui/material/Button";
import {StatusEnum} from "../../entities/StatusEnum.ts";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(3),
    justifyContent: "center",
  },
}));

export const HistoryPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [ordenes, setOrdenes] = useState<Order[]>([]);
  const { openModal, handleClose, handleOnClose, setMessage, handleOpen, message} =
    useActionsPage();
  const [idOrden, setIdOrden] = useState<number | null>(null);
  // Obtenemos solo las ordenes del usuario
  const fetchOrders = async () => {
    try {
      const response = await api.get("/ordenes/cliente");
      if (response.status === 200) {
        const orders = response.data as Order[];
        const filteredOrders = orders.filter(
            (order) => order.id_estado !== StatusEnum.INACTIVE
        )
        setOrdenes(filteredOrders);
      } else {
        console.error(response.statusText);
        setError(response.statusText);
      }
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message);
    }
  };

  useEffect(() => {
    void fetchOrders();
  }, []);

  const handleCancel = (id: number) => {
    setIdOrden(id);
    handleOpen();
  };

  const handleCancellation = async () => {
    if (idOrden) {
      try {
        const response = await api.delete(`/ordenes/cancelar/${idOrden}`);
        if (response.status === 200) {
          void fetchOrders();
          handleClose();
          setMessage("Se ha cancelado la orden con éxito");
        } else {
          setError(
            "Error al intentar cancelar la orden: " + response.statusText,
          );
        }
      } catch (error) {
        const apiError = error as ApiError;
        setError(apiError.message);
      }
    }
  };

  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <Snackbar
        open={!!error}
        onClose={handleOnClose}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      <Snackbar
          open={!!message}
          onClose={handleOnClose}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success">{message}</Alert>
      </Snackbar>
      <Typography variant="h4" sx={{ justifySelf: "center" }} gutterBottom>
        Historial de Ordenes
      </Typography>
      <OrderHistoryTable
        orders={ordenes}
        isOperator={false}
        onOrdersUpdate={fetchOrders}
        onCancel={handleCancel}
      />
      <DynamicModal
        open={openModal}
        title={"¿Seguro de que deseas cancelar esta orden?"}
        handleClose={handleClose}
      >
        <Box style={{ paddingTop: theme.spacing(5), width:"100%", display:"flex", flexDirection:"row" }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            onClick={() => handleCancellation()}
            style={{ color: theme.palette.text.secondary }}
          >
            Confirmar
          </Button>
          <Button
            variant="contained"
            fullWidth
            sx={{ backgroundColor: theme.palette.error.main }}
          >
            No
          </Button>
        </Box>
      </DynamicModal>
    </Box>
  );
};
