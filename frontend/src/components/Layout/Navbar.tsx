import React from "react";
import {AppBar, Box, IconButton, Theme, Toolbar, Typography} from "@mui/material";
import { Menu } from "@mui/icons-material";
import theme from "../../styles/theme";
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles<Theme>((theme: Theme) => ({
  logo: {
    color: theme.palette.text.primary,
    flexGrow: 1,
    fontWeight: "bold",
    "& .MuiTypography-root": {
      textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
    },
  },
  navBar:{
    backgroundColor: theme.palette.background.paper,
  }
}));

const Navbar: React.FC = () => {
  const classes = useStyles();

  return (
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <IconButton
            sx={{ color: theme.palette.primary.main }}
            size="large"
            edge="start"
            aria-label="menu"
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Mi Tiendita Online
          </Typography>
        </Toolbar>
      </AppBar>
  );
};

export default Navbar;
