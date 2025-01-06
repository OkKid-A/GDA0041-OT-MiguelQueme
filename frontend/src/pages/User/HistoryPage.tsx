import {Alert, Box, Theme, Typography} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { Order } from "../../entities/Order.ts";
import api from "../../utils/api.ts";
import ApiError from "../../contexts/types/ApiError.tsx";
import OrderHistoryTable from "../../components/order/OrderHistoryTable.tsx";
import theme from "../../styles/theme.tsx";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(3),
    justifyContent: "center",
  },
}));

export const HistoryPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [ordenes, setOrdenes] = useState<Order[]>([]);

  // Obtenemos solo las ordenes del usuario
  const fetchOrders = async () => {
    try {
      const response = await api.get("/ordenes/cliente");
      if (response.status === 200) {
        setOrdenes(response.data as Order[]);
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

  const classes = useStyles();
  return (
    <Box className={classes.container}>
      {error && (
        <Box mb={theme.spacing(3)}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
      <Typography variant="h4" sx={{justifySelf:"center"}} gutterBottom>
        Historial de Ordenes
      </Typography>
      <OrderHistoryTable orders={ordenes} isOperator={false}/>
    </Box>
  );
};
