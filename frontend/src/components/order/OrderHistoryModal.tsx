import React, { useState, useEffect, useRef } from "react";
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
  ClickAwayListener,
  Paper,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import theme from "../../styles/theme.tsx";
import { Order } from "../../entities/Order.ts";
import api from "../../utils/api.ts";
import ApiError from "../../contexts/types/ApiError.tsx";
import DeleteIcon from "@mui/icons-material/Delete";
import { StatusEnum } from "../../entities/StatusEnum.ts";
import parseOrderStatus from "../../utils/functions/parseOrderStatus.ts";
import CustomTextFieldDark from "../layout/CustomTextFieldDark.tsx";
import Product from "../../entities/Product.ts";
import ProductDetail from "../../entities/ProductDetail.ts";

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
  handleClose: (message: string | null) => void;
  order: Order | null;
  isOperator: boolean;
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
    maxWidth: 425,
  },
  listBody: {
    maxHeight: "40vh",
    overflowY: "auto",
  },
  searchListContainer: {
    position: "absolute",
    width: "20%",
    maxHeight: 200,
    overflowY: "auto",
    justifyContent: "center",
    backgroundColor: `${theme.palette.info.dark} !important`,
    zIndex: 1000,
  },
  searchListItem: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  searchList: {
    padding: theme.spacing(1),
  },
}));

const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  open,
  handleClose,
  order,
  isOperator,
}) => {
  const classes = useStyles();

  const [products, setProducts] = useState<Product[]>([]);
  const [productDetails, setProductDetails] = useState<ResponseDetail>();
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | null>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const listRef = useRef<HTMLDivElement>(null);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setIsOpen(true);
  };

  const handleSelectedProduct = (product: Product) => {
    const newDetail: ProductDetail = {
      id_detalle: null,
      precio: product.precio,
      id_producto: product.id_producto,
      cantidad: 1,
      subtotal: product.precio,
      marca: product.marca,
      codigo: product.codigo,
      foto: product.foto,
      nombre: product.nombre,
    };
    setProductDetails((prevDetails) => {
      if (!prevDetails) {
        return;
      } else {
        return {
          ...prevDetails,
          detalles: [...(prevDetails.detalles || []), newDetail],
        };
      }
    });
    setSearchQuery("");
    setIsOpen(false);
  };

  const handleClickAway = () => {
    setIsOpen(false);
  };

  const fetchProducts = async () => {
    console.log("Fetching products...");
    try {
      const response = await api.get("/productos");
      if (response.status === 200) {
        setProducts(response.data as Product[]);
      } else {
        console.error(response.statusText);
      }
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message);
    }
  };

  useEffect(() => {
    void fetchProducts();
  }, []);

  useEffect(() => {
    const filterItems = () => {
      if (!searchQuery) {
        setFilteredProducts([]);
        return;
      }

      const filtered = products.filter((item) => {
        const itemText = item.nombre.toLowerCase();
        return itemText.includes(searchQuery.toLowerCase());
      });
      const productFilteded = filtered.filter(
        (product) =>
          !productDetails?.detalles.some(
            (detail) => detail.id_producto === product.id_producto,
          ),
      );
      setFilteredProducts(productFilteded);
    };
    filterItems();
  }, [searchQuery, products, productDetails]);

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
        const newTotal = productDetails?.detalles.reduce(
          (acc, item) => acc + item.precio * item.cantidad,
          0,
        );
        setTotal(newTotal);
      }
    };
    calculateTotal();
  }, [productDetails]);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("es-MX");
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
    if (productDetails) {
      const updatedDetails = productDetails.detalles.map((item) =>
          item.id_producto === product.id_producto
              ? {
                ...item,
                subtotal : null,
              }
              : item,
      );
      console.log(updatedDetails);

        setProductDetails({ ...productDetails, detalles: updatedDetails });
      }
  };

  // Funcion para formatear los datos actualizados de los detalles en un json
  const formatedProductDetailsToJSON = (details: ProductDetail[]) => {
    return details.map((item) => ({
      id_producto: item.id_producto,
      cantidad: item.cantidad,
      precio: item.precio,
      subtotal: (item.subtotal===null ? null : item.precio * item.cantidad ),
      id_detalle: item.id_detalle,
    }));
  };

  const handleOrderUpdate = async () => {
    if (order) {
      try {
        console.log(productDetails!.detalles);
        const response = await api.put(`/ordenes/detalles/${order.id_orden}`, {
          json: formatedProductDetailsToJSON(productDetails!.detalles),
        });
        if (response.status === 200) {
          handleClose("Los cambios a la orden han sido guardados con éxito.");
        } else {
          setError(response.statusText);
        }
      } catch (error) {
        const apiError = error as ApiError;
        setError(apiError.message);
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => handleClose(null)}
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
              <Typography>
                Estado: {parseOrderStatus(order.id_estado)}
              </Typography>
              <Typography>
                Número de Productos: {productDetails?.detalles.length}
              </Typography>
              <Divider
                sx={{
                  marginTop: theme.spacing(2),
                  marginBottom: theme.spacing(1),
                }}
              />
              <Typography variant={"h6"}>Productos</Typography>
              {isOperator &&
                  order?.id_estado === StatusEnum.PENDING && (
                  <ClickAwayListener onClickAway={handleClickAway}>
                <div>
                  <CustomTextFieldDark
                    label="Agregar un producto"
                    fullWidth
                    value={searchQuery}
                    onChange={handleSearch}
                    onFocus={() => setIsOpen(true)}
                    id="reference"
                  />
                  {isOpen && (
                    <Paper
                      className={classes.searchListContainer}
                      ref={listRef}
                    >
                      <List className={classes.searchList}>
                        {filteredProducts.map((item) => (
                          <ListItem
                            key={item.id_producto}
                            className={classes.searchListItem}
                            onClick={() => handleSelectedProduct(item)}
                          >
                            <ListItemIcon className={classes.listItemIcon}>
                              <Avatar
                                src={item.foto}
                                alt={item.nombre}
                                variant={"rounded"}
                                className={classes.avatar}
                              />
                            </ListItemIcon>
                            <ListItemText primary={item.nombre} />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  )}
                </div>
              </ClickAwayListener>
                  )
              }
              <List className={classes.listBody}>
                {productDetails?.detalles
                  .filter((product) => product.subtotal != null)
                  .map((product: ProductDetail) => {
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
                        {isOperator &&
                          order?.id_estado === StatusEnum.PENDING && (
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
                          )}
                        {isOperator &&
                          order?.id_estado === StatusEnum.PENDING && (
                            <IconButton
                              sx={{ color: theme.palette.error.main }}
                              size={"small"}
                              onClick={() => removeFromOrder(product)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
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
                {isOperator && order?.id_estado === StatusEnum.PENDING && (
                  <Button onClick={handleOrderUpdate} variant={"outlined"}>
                    Guardar Cambios
                  </Button>
                )}
                <Button
                  onClick={() => handleClose(null)}
                  variant="contained"
                  sx={{ backgroundColor: theme.palette.error.main }}
                >
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
