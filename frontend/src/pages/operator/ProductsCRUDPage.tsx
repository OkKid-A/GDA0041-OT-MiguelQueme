import React, { useEffect, useState } from "react";
import {Alert, Box, Snackbar, Theme, Typography} from "@mui/material";
import { makeStyles } from "@mui/styles";
import api from "../../utils/api.ts";
import ProductExpanded from "../../entities/ProductExpanded.ts";
import ApiError from "../../contexts/types/ApiError.tsx";
import ProductCRUDTable from "../../components/product/ProductCRUDTable.tsx";
import theme from "../../styles/theme.tsx";
import { Add } from "@mui/icons-material";
import Button from "@mui/material/Button";
import ProductModal from "../../components/product/ProductModal.tsx";
import useActionsPage from "../../hooks/useActionsPage.ts";
import Searchbar from "../../components/layout/Searchbar.tsx";

const useStyles = makeStyles<Theme>((theme: Theme) => ({
  container: {
    maxWidth: "90%",
    margin: theme.spacing(2, "auto"),
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(3),
  }
}));

const ProductsCRUDPage: React.FC = () => {
  const classes = useStyles();
  const [products, setProducts] = useState<ProductExpanded[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<ProductExpanded[]>([]);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const {
    error,
    setError,
    message,
    setMessage,
    handleOpen,
    openModal,
    handleOnClose,
    handleClose,
  } = useActionsPage();

  const handleResult = (message: string) => {
    void fetchProducts();
    setMessage(message);
  }

  useEffect(() => {
    if (searchQuery === '' || searchQuery === null || searchQuery === undefined) {
      setDisplayedProducts(products);
    } else {
      const filteredProducts = products.filter( product =>
          product.marca.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.categoria.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.id_producto.toString() === searchQuery
      )
      setDisplayedProducts(filteredProducts);
    }
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/productos/todos");
      if (response.status === 200) {
        setProducts(response.data as ProductExpanded[]);
        setDisplayedProducts(products);
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
    void fetchProducts();
  }, []);

  return (
    <Box className={classes.container}>
      <Snackbar
          open={!!message}
          onClose={handleOnClose}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success">{message}</Alert>
      </Snackbar>
      {error && (
        <Box mb={theme.spacing(3)}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
      <Box className={classes.header}>
        <Typography component="h3" variant="h3" sx={{color: theme.palette.text.primary}}>
          Productos
        </Typography>
        <Searchbar label="Busca por ID, nombre, Categoria o marca" searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Button  variant="contained" onClick={handleOpen}>
          <Add /> Añadir Producto
        </Button>
      </Box>
      <ProductCRUDTable products={displayedProducts} onUpdate={fetchProducts} />
      <ProductModal handleClose={handleClose} handleResult={handleResult} open={openModal} product={null}/>
    </Box>
  );
};

export default ProductsCRUDPage;
