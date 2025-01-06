import React, { useEffect, useState } from "react";
import OrderHistoryTable from "../../components/order/OrderHistoryTable.tsx";
import api from "../../utils/api.ts";
import { Order } from "../../entities/Order.ts";
import ApiError from "../../contexts/types/ApiError.tsx";
import { Alert, Box, Theme, Typography } from "@mui/material";
import theme from "../../styles/theme.tsx";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(3),
    justifyContent: "center",
  },
}));

const OperatorHomePage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const classes = useStyles();

  const fetchOrders = async () => {
    try {
      const response = await api.get("/ordenes");
      if (response.status === 200) {
        setOrders(response.data as Order[]);
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

  return (
    <Box className={classes.container}>
      {error && (
        <Box mb={theme.spacing(3)}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
      <Typography component="h3" variant="h3" sx={{ justifySelf: "center",color: theme.palette.text.primary}}>
        Historial de Ordenes
      </Typography>
      <OrderHistoryTable
        orders={orders}
        isOperator={true}
        onOrdersUpdate={fetchOrders}
      />
    </Box>
  );
};

export default OperatorHomePage;
