import React, {useContext} from "react";
import {
  AppBar,
  Box,
  IconButton,
  Theme,
  Toolbar,
  Typography,
} from "@mui/material";
import   Badge from "@mui/material/Badge";
import { Logout, Menu, ShoppingCart } from "@mui/icons-material";
import theme from "../../styles/theme";
import { makeStyles } from "@mui/styles";
import CartContext from "../../contexts/carrito/CartContext.tsx";

const useStyles = makeStyles<Theme>((theme: Theme) => ({
  logo: {
    color: theme.palette.text.primary,
    flexGrow: 1,
    fontWeight: "bold",
    "& .MuiTypography-root": {
      textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
    },
  },   toolbar: {
    display: "flex",
    justifyContent: "space-between"
  },
  navBar: {
    backgroundColor: theme.palette.background.paper,
  },
  navbarRigth: {
    display: "flex",
    justifyContent: "center",
  },
}));

interface NavbarProps {
  toggleSidebar: () => void;
  onLogout: () => void;
  onCartClick?: () => void;
  showCart?: boolean;
  cartCount?: number;
}

const Navbar: React.FC<NavbarProps> = ({
  toggleSidebar,
  onCartClick,
  onLogout,
  showCart,
}) => {
  const classes = useStyles();
  const cartContext =  useContext(CartContext);

  return (

    <AppBar
      position="static"
      sx={{ backgroundColor: theme.palette.background.paper }}
    >
      <Toolbar className={classes.toolbar}>
        <IconButton
          sx={{ color: theme.palette.text.primary }}
          size="large"
          edge="start"
          aria-label="menu"
          onClick={() => toggleSidebar()}
        >
          <Menu />
        </IconButton>
        <Typography
          variant="h6"
          sx={{ color: theme.palette.text.primary}}
          className={classes.logo}
        >
          Mi Tiendita Online
        </Typography>
        <Box className={classes.navBarRight}>
          {showCart && (
            <IconButton
              sx={{ color: theme.palette.text.primary }}
              size="large"
              aria-label="cart"
              onClick={onCartClick}
            >
              {cartContext?.cart?.length ? (
                <Badge
                    anchorOrigin={{vertical: "bottom"}}
                  badgeContent={cartContext.cart.length}
                  sx={{ color: theme.palette.primary.light,fontWeight: "bold" }}
                >
                  <ShoppingCart sx={{color:theme.palette.text.primary}} />
                </Badge>
              ) : (
                <ShoppingCart />
              )}
            </IconButton>
          )}
          <IconButton
            sx={{ color: theme.palette.text.primary }}
            size="large"
            aria-label="logout"
            onClick={onLogout}
          >
            <Logout />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>

  );
};

export default Navbar;
