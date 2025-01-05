import Layout from "../../components/layout/Layout.tsx";
import React, { useContext, useEffect, useState } from "react";
import Product from "../../entities/Product.ts";
import {
  Alert,
  Box,
  Snackbar,
  TextField,
  Theme,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import api from "../../utils/api.ts";
import ApiError from "../../contexts/types/ApiError.tsx";
import theme from "../../styles/theme.tsx";
import ProductList from "../../components/product/ProductList.tsx";
import CartContext from "../../contexts/carrito/CartContext.tsx";
import { useCart } from "../../hooks/useCart.ts";
import CartSidebar from "../../components/product/CartSidebar.tsx";

const useStyles = makeStyles((theme: Theme) => ({

  container: {
    padding: theme.spacing(3),
  },
  textFieldContainer: {
    paddingLeft: theme.spacing(65),
    paddingRight: theme.spacing(65),
  },
  textField: {
    "& .MuiOutlinedInput-root": {
      "&:hover": {
        color: "#ffffff",
      },
      backgroundColor: theme.palette.info.dark,
      "&.Mui-focused": {
        color: theme.palette.primary.main,
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(255,255,255,0.64)",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#ffffff", // Cambiamos el texto a blanco
      "&.Mui-focused": {
        color: theme.palette.primary.main,
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#314c84",
      "&.Mui-focused": {
        color: theme.palette.primary.main,
      },
    },
    "& .MuiOutlinedInput-input": {
      color: theme.palette.text.primary,
    },
  }
}));

export const UsuarioHomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const classes = useStyles();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const cartContext = useContext(CartContext);
  const { cart, removeFromCart, updateQuantity, open, setOpen, clearCart } = useCart();

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

  // Actualiza los productos mostrados segun el input
  useEffect(() => {
    const filterProducts = () => {
      if (!searchQuery) {
        setFilteredProducts(products);
        return;
      }
      const filtered = products.filter((product) => {
        return (
          product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.marca.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.categoria.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      setFilteredProducts(filtered);
    };
    filterProducts();
  }, [searchQuery, products]);

  // cambia el estado para que se ejecute el useeffect
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleToggle = () => {
    setOpen(!open);
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
      {error && (
        <Box mb={theme.spacing(3)}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
      <div className={classes.container}>
        <div className={classes.textFieldContainer}>
          <TextField
            label="Busqueda de Productos"
            variant="outlined"
            fullWidth
            className={classes.textField}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <ProductList products={filteredProducts} />
      </div>
    </Layout>
  );
};
