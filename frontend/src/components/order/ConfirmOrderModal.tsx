import React from "react";
import {
  Box,
  Fade,
  Modal,
  Theme,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import theme from "../../styles/theme.tsx";
import UserOrderForm from "./UserOrderForm.tsx";
import { useCart } from "../../hooks/useCart.ts";
import api from "../../utils/api.ts";
import { OrderDetail } from "../../entities/OrderDetail.ts";
import Product from "../../entities/Product.ts";
import ApiError from "../../contexts/types/ApiError.tsx";

interface ConfirmOrderModalProps {
  open: boolean;
  handleClose: () => void;
  handleToggle: (resultado: string | null) => void;
}

const useStyles = makeStyles<Theme>((theme: Theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: theme.spacing(4),
  },
  modalContent: {
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${theme.palette.primary.main}`,
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
  },
}));

const ConfirmOrderModal: React.FC<ConfirmOrderModalProps> = ({
  open,
  handleClose,
    handleToggle,
}) => {
  const { cart, clearCart } = useCart();
  const classes = useStyles();
  const handleSubmit = async (data: {
    calle: string;
    numero: string;
    municipio: string;
    departamento: string;
    codigoPostal: string;
  }): Promise<void> => {
    const fechaDummie = new Date();
    fechaDummie.setDate(fechaDummie.getDate() + 4);

    // Formateamos el carrito para incluir los datos ncecesarios para ingresar los detalles de orden
    const formatedOrderJson = (
      cart: { product: Product; quantity: number }[],
    ): OrderDetail[] => {
      return cart.map((item) => ({
        id_producto: item.product.id_producto,
        cantidad: item.quantity,
        precio: item.product.precio,
        subtotal: item.product.precio * item.quantity,
      }));
    };
    console.log(formatedOrderJson(cart));
    try {
      // Enviamos la orden hacia la api incluyenbdo todos los productos del carrito
      const response = await api.post("/ordenes", {
        direccion: `${data.numero}, ${data.calle}, ${data.municipio}, ${data.departamento}, ${data.codigoPostal}`,
        fecha_entrega: fechaDummie,
        json: formatedOrderJson(cart),
      });
      if (response.status === 200) {
        clearCart(); // Limpiamos el carrito
        handleToggle("Se envio la solicitud de orden con exito."); // Cerramos la sidebar
        handleClose(); // Cerramos el modal
      }
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.message ?? "Error desconocido al iniciar sesión";
      throw new Error(errorMessage);
    }
  };

  return (
      <Box>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
        >
          <Fade in={open}>
            <Box className={classes.modalContent}>
              <Typography
                  variant="h6"
                  component="h2"
                  sx={{ justifySelf: "center" }}
              >
                Confirmar Compra
              </Typography>
              <Typography sx={{ mt: 2, justifySelf: "center" }}>
                Ingresa tu direccion
              </Typography>
              <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: theme.spacing(1),
                    marginTop: theme.spacing(2),
                  }}
              >
                <UserOrderForm
                    handleCancelar={handleClose}
                    onSubmit={handleSubmit}
                />
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Box>

  );
};

export default ConfirmOrderModal;
