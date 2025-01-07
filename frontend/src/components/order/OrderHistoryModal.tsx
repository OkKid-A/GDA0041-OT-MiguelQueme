import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Fade,
  Modal,
  Theme,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Avatar,
  ListItemIcon,
  IconButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import theme from "../../styles/theme.tsx";
import { Order } from "../../entities/Order.ts";
import api from "../../utils/api.ts";
import ApiError from "../../contexts/types/ApiError.tsx";
import DeleteIcon from "@mui/icons-material/Delete";

interface ProductDetail {
  id_detalle: number;
  id_producto: number;
  cantidad: number;
  precio: number;
  subtotal: number;
  nombre: string;
  marca: string;
  codigo: string;
  foto: string;
}

interface ResponseDetail {
  id_orden: number;
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  correo: string;
  fecha_entrega: string;
  total_orden: number;
  fecha_creacion: string;
  id_usuario: number;
  id_estado: number;
  detalles: ProductDetail[];
}

interface OrderHistoryModalProps {
  open: boolean;
  handleClose: () => void;
  order: Order | null;
}

const useStyles = makeStyles<Theme>((theme: Theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${theme.palette.primary.main}`,
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
  },
}));

const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  open,
  handleClose,
  order,
}) => {
  const classes = useStyles();
  const [productDetails, setProductDetails] = useState<ResponseDetail>();
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (order) {
        setTotal(order.total_orden);
        try {
          const response = await api.get(`/ordenes/${order.id_orden}`);
          if (response.status === 200) {
            const data = response.data as Record<string, string>;
            const key = Object.keys(data)[0];
            if (!key) {
              console.error("No existe la llave" + response.data);
            }
            const jsonAsString = data[key];
            // Creamos el objeto
            const parsedOrder = JSON.parse(jsonAsString) as ResponseDetail;
            setProductDetails(parsedOrder);
          } else {
            console.error("Could not get the products of the order");
          }
        } catch (error) {
          const apiError = error as ApiError;
          setError(apiError.message);
        }
      }
    };
    void fetchOrderDetails();
  }, [order]);

  useEffect(() => {
      const calculateTotal = () => {
        if (productDetails) {
          const newTotal = productDetails?.detalles.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)
          setTotal(newTotal);
        }
      };
      calculateTotal();
  }, [productDetails]);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("es-MX");
  };

  const traducirEstado = (id_estado: number) => {
    switch (id_estado) {
      case 1:
        return "Entregada";
      case 2:
        return "Pendiente";
      default:
        return "Error";
    }
  };

  const updateQuantity = (product: ProductDetail, cantidad: number) => {
    if (productDetails) {
      const updatedDetails = productDetails.detalles.map((item) =>
        item.id_producto === product.id_producto
          ? {
              ...item,
              cantidad,
            }
          : item,
      );
      setProductDetails({ ...productDetails, detalles: updatedDetails });
    }
  };

  const removeFromOrder = (product: ProductDetail) => {
    if(productDetails){
      const isInCartIndex = productDetails.detalles.findIndex(
          (item) => item.id_producto === product.id_producto,
      );

      if (isInCartIndex >= 0) {
        const updatedDetails = productDetails.detalles.filter((_, index) => index !== isInCartIndex);
        setProductDetails({...productDetails, detalles: updatedDetails});
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
    >
      <Fade in={open}>
        <Box className={classes.modalContent}>
          {error && (
            <Box mb={theme.spacing(3)}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {order && (
            <>
              <Typography variant="h6" component="h2">
                Detalles de la Orden: {order.id_orden}
              </Typography>
              <Divider />
              <Typography>
                Fecha de Creacion: {formatDate(order.fecha_creacion.toString())}
              </Typography>
              <Typography>
                Fecha de Entrega: {formatDate(order.fecha_entrega.toString())}
              </Typography>
              <Typography>Direccion de Entrega: {order.direccion}</Typography>
              <Typography>
                Nombre: {order.nombre} {order.apellido}
              </Typography>
              <Typography>Total: Q{total?.toFixed(2)}</Typography>
              <Typography>Estado: {traducirEstado(order.id_estado)}</Typography>
              <Typography>Numero de Productos: {order.cantidad}</Typography>
              <Divider
                sx={{
                  marginTop: theme.spacing(2),
                  marginBottom: theme.spacing(1),
                }}
              />
              <Typography variant={"h6"}>Productos</Typography>
              <List>
                {productDetails?.detalles.map((product: ProductDetail) => {
                  return (
                    <ListItem key={product.id_producto}>
                      <ListItemIcon className={classes.listItemIcon}>
                        <Avatar
                          src={product.foto}
                          alt={product.nombre}
                          variant={"rounded"}
                          className={classes.avatar}
                        />
                      </ListItemIcon>
                      <ListItemText
                        sx={{
                          ".MuiListItemText-secondary": {
                            color: theme.palette.text.primary,
                          },
                        }}
                        primary={product.nombre}
                        secondary={`Cantidad: ${product.cantidad}, Precio: Q${product.precio}`}
                      />
                      <Box className={classes.quantitySelector}>
                        <IconButton
                          size={"small"}
                          onClick={() =>
                            updateQuantity(product, product.cantidad - 1)
                          }
                          disabled={product.cantidad <= 1}
                          sx={{ color: theme.palette.text.primary }}
                        >
                          -
                        </IconButton>
                        {product.cantidad}
                        <IconButton
                          size={"small"}
                          onClick={() =>
                            updateQuantity(product, product.cantidad + 1)
                          }
                          sx={{ color: theme.palette.text.primary }}
                        >
                          +
                        </IconButton>
                      </Box>
                      <IconButton
                        sx={{ color: theme.palette.error.main }}
                        size={"small"}
                        onClick={() => removeFromOrder(product)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  );
                })}
              </List>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: theme.spacing(1),
                  marginTop: theme.spacing(2),
                }}
              >

                <Button onClick={handleClose} variant="outlined">
                  Cerrar
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default OrderHistoryModal;
