import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth.ts";
import {Box, CardContent, Divider, Theme, Typography} from "@mui/material";
import LoginForm from "../../components/auth/LoginForm.tsx";
import Card from "@mui/material/Card";
import { makeStyles } from "@mui/styles";
import { useLocation } from "react-router-dom";
import { Alert } from "@mui/material";
import theme from "../../styles/theme.tsx";
import ApiError from "../../contexts/types/ApiError.tsx";

const useStyles = makeStyles<Theme>((theme: Theme) => ({
  root: {
    background:
      "radial-gradient(circle at center, " +
      theme.palette.background.paper +
      ", black)",
    minHeight: "100vh",
    minWidth: "100vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    margin: 0,
    padding: 0,
  },
  Card: {
    width: "100%",
    maxWidth: "350px",
    minHeight: "400px",
    padding: theme.spacing(4),
    margin: "auto",
    display: "flex",
    alignItems: "center",
    position: "absolute",
    borderRadius: "16px",
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  },
  logo: {
    justifySelf: "center",
    color: theme.palette.text.primary,
    paddingBottom: theme.spacing(150),
  },
  error: {
    color: theme.palette.error.main,
    marginTop: theme.spacing(25),
  },
  title: {
    color: theme.palette.text.primary,
    paddingBottom: "10px",
    fontWeight: "bold",
    "& .MuiTypography-root": {
      textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
    },
  },
}));

interface LocationState {
  error?: string | null;
}

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const classes = useStyles();
  const location = useLocation();
  const locationState = location.state as LocationState;
  const [error, setError] = useState<string | null>(
    locationState?.error ?? null,
  );

  useEffect(() => {
    if (locationState?.error) {
      setError(locationState?.error);
      locationState.error = null; //
    }
  }, [location.state]);

  const manejarLogin = async (data: {
    correo: string;
    password: string;
  }): Promise<void> => {

    try {
      await login(data.correo, data.password);
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message);
      console.error(error);
    }
  };

  return (
    <Box className={classes.root}>
      {error && (
        <Box mb={theme.spacing(3)}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
      <Typography className={classes.logo} variant="h2" component="h1">
        Mi Tiendita Online
      </Typography>
      <Card
        variant="outlined"
        className={classes.Card}
        style={{ borderRadius: "16px" }}
      >
        <CardContent>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            className={classes.title}
          >
            Iniciar Sesión
          </Typography>
          <Divider />
          <LoginForm onSubmit={manejarLogin} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
