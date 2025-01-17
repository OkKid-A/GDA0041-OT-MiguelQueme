import React, { useEffect, useState } from "react";
import OrderHistoryTable from "../../components/order/OrderHistoryTable.tsx";
import api from "../../utils/api.ts";
import { Order } from "../../entities/Order.ts";
import ApiError from "../../contexts/types/ApiError.tsx";
import { Alert, Box, Theme, Typography } from "@mui/material";
import theme from "../../styles/theme.tsx";
import { makeStyles } from "@mui/styles";
import parseOrderStatus from "../../utils/functions/parseOrderStatus.ts";
import Searchbar from "../../components/layout/Searchbar.tsx";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(3),
    justifyContent: "center",
  },
}));

const OperatorHomePage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [displayedOrders, setDisplayedOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const classes = useStyles();

  useEffect(() => {

    if (searchQuery === '' || searchQuery === null || searchQuery === undefined) {
      setDisplayedOrders(orders);
    } else {
      const filteredOrders = orders.filter( order =>
          parseOrderStatus(order.id_estado).toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id_orden.toString() === searchQuery ||
      order.usuarioNombre?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setDisplayedOrders(filteredOrders);
    }
  }, [searchQuery, orders]);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/ordenes");
      if (response.status === 200) {
        console.log(response.data);
        setOrders(response.data as Order[]);
        console.log(orders);
        setDisplayedOrders(orders);
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
      <Typography
        component="h3"
        variant="h3"
        sx={{ justifySelf: "center", color: theme.palette.text.primary }}
      >
        Historial de Ordenes
      </Typography>
        <Searchbar label="Busca por ID, Estado o Nombre de Usuario" searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <OrderHistoryTable
        orders={displayedOrders}
        isOperator={true}
        onOrdersUpdate={fetchOrders}
        onCancel={null}
      />
    </Box>
  );
};

export default OperatorHomePage;
