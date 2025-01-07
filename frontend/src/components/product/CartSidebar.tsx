import React, {useEffect, useState} from "react";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Theme,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import theme from "../../styles/theme.tsx";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CartList from "./CartList.tsx";
import Button from "@mui/material/Button";
import Product from "../../entities/Product.ts";
import ConfirmOrderModal from "../order/ConfirmOrderModal.tsx";

const useStyles = makeStyles<Theme>((theme: Theme) => ({
  sidebarDrawer: {
    "& .MuiDrawer-paper": {
      backgroundColor: theme.palette.background.paper,
      maxWidth: 400,
      display: "flex",
      flexDirection: "column",
    },
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
  sideBarIcon: {
    "& svg": {
      color: theme.palette.text.primary,
    },
  },
  cartListContainer: {
    flexGrow: 1,
    overflowY: "auto",
  },
  cartActionsContainer: {
    minWidth: 400,
    flexDirection: "column",
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(2),
  },
}));

interface CartDrawerProps {
  open: boolean;
  handleToggle: (resultado: string | null) => void;
  products: { product: Product; quantity: number }[];
  onRemoveFromCart: (product: Product) => void;
  onUpdateQuantity: (product: Product, quantity: number) => void;
  onClearCart: () => void;
}

const CartSidebar: React.FC<CartDrawerProps> = ({
  open,
  handleToggle,
  products,
  onRemoveFromCart,
  onUpdateQuantity,
  onClearCart,
}) => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  const [total, setTotal] = useState(0)

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  useEffect(() => {
    const calculateTotal = () => {
      const newTotal = products.reduce((acc, item) => acc + (item.product.precio * item.quantity), 0)
      setTotal(newTotal);
    };
    calculateTotal();
  }, [products]);

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="temporary"
        anchor="right"
        open={open}
        onClose={() => handleToggle(null)}
        className={classes.sidebarDrawer}
      >
        <div className={classes.drawerHeader}>
          <IconButton
            sx={{ color: theme.palette.text.primary }}
            onClick={() => handleToggle(null)}
          >
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h6" paddingLeft={theme.spacing(2)}>
            Carrito
          </Typography>
        </div>
        <Divider color={theme.palette.divider} />
        <Box className={classes.cartListContainer}>
          <CartList
            products={products}
            onRemoveFromCart={onRemoveFromCart}
            onUpdateQuantity={onUpdateQuantity}
          />
        </Box>
        <Box className={classes.cartTotal}>
          <Typography variant={"h6"}  >
            Total: Q {total.toFixed(2)}
          </Typography>
        </Box>
        <Box className={classes.cartActionsContainer}>

          <Button
            variant="contained"
            color="primary"
            disabled={products.length === 0}
            sx={{
              "&.Mui-disabled": {
                color: theme.palette.text.primary,
              },
            }}
            onClick={handleOpen}
          >
            Confirmar Compra
          </Button>
          <Button onClick={onClearCart}>Borrar Carrito</Button>
          <ConfirmOrderModal open={modalOpen} handleClose={handleClose} handleToggle={handleToggle}/>
        </Box>
      </Drawer>
    </Box>
  );
};

export default CartSidebar;
