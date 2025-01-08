import Card from "@mui/material/Card";
import {
  Box,
  CardActions,
  CardContent,
  CardMedia,
  Theme,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import theme from "../../styles/theme.tsx";
import React, {ReactNode} from "react";
import Product from "../../entities/Product.ts";

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    maxWidth: 350,
    margin: theme.spacing(1),
    flexDirection: "column",
    justifyContent: "flex-start",
    overflow: "hidden",
  },
  cardImage: {
    height: 200,
    width: "auto",
    overflow: "hidden",
    justifySelf: "center",
  },
  cardContent: {
    paddingBottom: "0 !important",
  },
  cardDetail: {
    marginTop: theme.spacing(1),
  },
  cardLabel: {
    color: theme.palette.info.main,
    fontweight: "bold",
    marginBottom: theme.spacing(2),
  },
  cardActions: {
    justifyContent: "center",
    padding: theme.spacing(1),
  },
}));

interface ProductCardProps {
  product: Product;
  cardActions: ReactNode
}

const ProductCard: React.FC<ProductCardProps> = ({ product, cardActions }) => {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardMedia
        component="img"
        alt={product.nombre}
        image={product.foto}
        className={classes.cardImage}
      />
      <CardContent className={classes.cardContent}>
        <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
          {product.nombre}
        </Typography>
        <Box className={classes.cardDetail}>
          <Typography variant="body2" display={"inline"}>
            <span className={classes.cardLabel}>Marca:</span>
            {product.marca}
          </Typography>
        </Box>
        <Box className={classes.cardDetail}>
          <Typography variant="body2" display={"inline"}>
            <span className={classes.cardLabel}>Precio:</span>Q
            {product.precio.toFixed(2)}
          </Typography>
        </Box>
      </CardContent>
      <CardActions className={classes.cardActions}>
        {cardActions}
      </CardActions>
    </Card>
  );
};

export default ProductCard;
