import { makeStyles } from "@mui/styles";
import { Alert, Box, Snackbar, Theme, Typography } from "@mui/material";
import useActionsPage from "../../hooks/useActionsPage.ts";
import React, { useEffect, useState } from "react";
import UserExpanded from "../../entities/UserExpanded.ts";
import api from "../../utils/api.ts";
import ApiError from "../../contexts/types/ApiError.tsx";
import theme from "../../styles/theme.tsx";
import Button from "@mui/material/Button";
import { Add } from "@mui/icons-material";
import UserModal from "../../components/usuario/UserModal.tsx";
import UserCRUDTable from "../../components/usuario/UserCRUDTable.tsx";

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
  },
}));

const UserCRUDPage: React.FC = () => {
  const classes = useStyles();
  const [users, setUsers] = useState<UserExpanded[]>([]);
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
    void fetchUsers();
    setMessage(message);
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get("/usuarios/");
      if (response.status === 200) {
        setUsers(response.data as UserExpanded[]);
      } else {
        console.error(response.status);
        setError(response.statusText);
      }
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message);
    }
  };

  useEffect(() => {
    void fetchUsers();
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
        <Typography
          component="h3"
          variant="h3"
          sx={{ color: theme.palette.text.primary }}
        >
          Usuarios
        </Typography>
        <Button variant="contained" onClick={handleOpen}>
          <Add /> Añadir usuario
        </Button>
      </Box>
      <UserCRUDTable users={users} onUpdate={fetchUsers}/>
      <UserModal open={openModal} handleClose={handleClose} handleResult={handleResult}/>
    </Box>
  );
};

export default UserCRUDPage;