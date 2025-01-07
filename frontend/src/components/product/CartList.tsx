import React from "react";
import { Theme, Box, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ProductCard from "./ProductCard.tsx";
import { makeStyles } from "@mui/styles";
import Product from "../../entities/Product.ts";
import DeleteIcon from "@mui/icons-material/Delete";
import theme from "../../styles/theme.tsx";

interface CardListProps {
  products: { product: Product; quantity: number }[];
  onRemoveFromCart: (product: Product) => void;
  onUpdateQuantity: (product: Product, quantity: number) => void;
}
const useStyles = makeStyles<Theme>((theme: Theme) => ({
  productListContainer: {
    justifyContent: "center",
    padding: theme.spacing(2),
  },
  cardContainer: {
    maxWidth: 200,
    overflow: "hidden",
  },
  cartActions: {
    display: "flex",
    justifyContent: "space-between",
  },
  quantitySelector: {
    color: theme.palette.text.primary,
    display: "flex",
    gap: theme.spacing(1),
    alignItems: "center",
  },
}));
const CartList: React.FC<CardListProps> = ({
  products,
  onRemoveFromCart,
  onUpdateQuantity,
}) => {
  const classes = useStyles();
  return (
    <Grid
      className={classes.productListContainer}
      container
      spacing={{ xs: 12, md: 12 }}
      columns={{ xs: 12, sm: 12, md: 12, lg:12 }}
    >
      {products.map(({ product, quantity }) => (
        <Grid
            size={{xs:12, sm:12, md:12, lg:12}}
          key={product.id_producto}
          className={classes.cardContainer}
        >
          <ProductCard
            product={product}
            cardActions={
              <Box className={classes.cartActions}>
                <Box className={classes.quantitySelector}>
                  <IconButton
                    size={"small"}
                    onClick={() => onUpdateQuantity(product, quantity - 1)}
                    disabled={quantity <= 1}
                    sx={{color:theme.palette.text.primary}}
                  >
                    -
                  </IconButton>
                  {quantity}
                  <IconButton
                    size={"small"}
                    onClick={() => onUpdateQuantity(product, quantity + 1)}
                    sx={{color:theme.palette.text.primary}}
                  >
                    +
                  </IconButton>
                </Box>
                <IconButton
                  sx={{ color: theme.palette.error.main }}
                  size={"small"}
                  onClick={() => onRemoveFromCart(product)}

                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            }
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default CartList;
