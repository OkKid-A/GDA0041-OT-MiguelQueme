import React, { ReactNode, useContext, useState } from "react";
import Layout from "./Layout.tsx";
import CartSidebar from "../product/CartSidebar.tsx";
import { Alert, Snackbar } from "@mui/material";
import CartContext from "../../contexts/carrito/CartContext.tsx";
import { useCart } from "../../hooks/useCart.ts";

interface LayoutProps {
  children: ReactNode;
}

const UserLayout: React.FC<LayoutProps> = ({ children }) => {
  const [resultado, setResultado] = useState<string | null>(null);
  const cartContext = useContext(CartContext);
  const { cart, removeFromCart, updateQuantity, open, setOpen, clearCart } =
    useCart();

  const handleOnClose = () => {
    setResultado(null);
  };

  const handleToggle = (resultado: string | null) => {
    setOpen(!open);
    console.log(resultado);
    if (resultado) {
      setResultado(resultado);
    }
  };

  return (
    <Layout>
      <CartSidebar
        open={open}
        handleToggle={handleToggle}
        products={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={removeFromCart}
        onClearCart={clearCart}
      />
      <Snackbar
        open={!!resultado}
        autoHideDuration={3000}
        onClose={handleOnClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success">{resultado}</Alert>
      </Snackbar>
      {cartContext?.addedMessage ? (
        <Snackbar
          open={true}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success">{cartContext?.addedMessage}</Alert>
        </Snackbar>
      ) : (
        ""
      )}


       {children}
    </Layout>
  );
};

export default UserLayout;
