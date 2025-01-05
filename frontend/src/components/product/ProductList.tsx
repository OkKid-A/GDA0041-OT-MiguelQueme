import Product from "../../entities/Product";
import Grid from "@mui/material/Grid2";
import { makeStyles } from "@mui/styles";
import {Box, IconButton, Theme} from "@mui/material";
import ProductCard from "./ProductCard.tsx";
import React from "react";
import {useCart} from "../../hooks/useCart.ts";
import theme from "../../styles/theme.tsx";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

const useStyles = makeStyles((theme: Theme) => ({
  productListContainer: {
    padding: theme.spacing(2),
    justifyContent: "center",
  },
  item:{
    maxWidth: 350,
    justifySelf: "center",
  }
}));

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const classes = useStyles();
  const {addToCart} = useCart();

  return (
    <Grid
      className={classes.productListContainer}
      container
      spacing={{ xs: 2, md: 8 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
    >
      {products.map((product) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id_producto} className={classes.item}>
          <ProductCard
            product={product}
            cardActions={
            <Box>
              {product.stock > 0 ? (
                  <IconButton
                      onClick={() => addToCart(product)}
                      sx={{ color: theme.palette.primary.light, fontSize: 16 }}
                  >
                    <AddShoppingCartIcon />
                  </IconButton>
              ) : (
                  <IconButton
                      sx={{ color: theme.palette.error.main }}
                  >
                    Out of Stock
                  </IconButton>
              )}
            </Box>}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList;