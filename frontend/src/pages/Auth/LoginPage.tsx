import React from "react";
import { useAuth } from "../../hooks/useAuth.ts";
import { CardContent, CardHeader, Theme, Typography } from "@mui/material";
import LoginForm from "../../components/Auth/LoginForm.tsx";
import Card from "@mui/material/Card";
import { makeStyles } from "@mui/styles";
import theme from "../../styles/theme.tsx";

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
}));

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const classes = useStyles();
  const manejarLogin = async (data: {
    correo: string;
    password: string;
  }): Promise<void> => {
    console.log("login success");

    try {
      console.log("login success");
      await login(data.correo, data.password);
      console.log("login success");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={classes.root}>
      <Typography className={classes.logo} variant="h2" component="h1">
        Mi Tiendita Online
      </Typography>
      <Card variant="outlined" className={classes.Card}>
        <CardHeader>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            style={{ color: theme.palette.text.primary, paddingBottom: "10px" }}
          >
            Iniciar Sesión
          </Typography>
        </CardHeader>
        <CardContent>
          <LoginForm onSubmit={manejarLogin} />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
