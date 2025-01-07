import React, {useEffect, useState} from "react";
import { Alert, Box, Snackbar, Theme, Typography } from "@mui/material";
import theme from "../../styles/theme.tsx";
import Button from "@mui/material/Button";
import { Add } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import CategoryExpanded from "../../entities/CategoryExpanded.ts";
import ApiError from "../../contexts/types/ApiError.tsx";
import api from "../../utils/api.ts";
import useActionsPage from "../../hooks/useActionsPage.ts";
import CategoriesCRUDTable from "../../components/category/CategoriesCRUDTable.tsx";
import CategoryModal from "../../components/category/CategoryModal.tsx";

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

const CategoriesCRUDPage: React.FC = () => {
  const classes = useStyles();
  const [categories, setCategories] = useState<CategoryExpanded[]>([]);
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
    void fetchCategories();
    setMessage(message);
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categorias/");
      if (response.status === 200) {
        setCategories(response.data as CategoryExpanded[]);
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
    void fetchCategories();
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
          Categorias
        </Typography>
        <Button variant="contained" onClick={handleOpen}>
          <Add /> Añadir Categoria
        </Button>
      </Box>
      <CategoriesCRUDTable categories={categories} onUpdate={fetchCategories} />
      <CategoryModal
        handleClose={handleClose}
        handleResult={handleResult}
        open={openModal}
        category={null}
      />
    </Box>
  );
};

export default CategoriesCRUDPage;
