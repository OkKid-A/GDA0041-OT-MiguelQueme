import React from "react";
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
  handleToggle: () => void;
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

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="temporary"
        anchor="right"
        open={open}
        onClose={handleToggle}
        className={classes.sidebarDrawer}
      >
        <div className={classes.drawerHeader}>
          <IconButton
            sx={{ color: theme.palette.text.primary }}
            onClick={() => handleToggle()}
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
          >
            Confirmar Compra
          </Button>
          <Button onClick={onClearCart}>Borrar Carrito</Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default CartSidebar;
