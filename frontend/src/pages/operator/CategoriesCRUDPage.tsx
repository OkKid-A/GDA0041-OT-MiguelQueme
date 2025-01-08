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
import Searchbar from "../../components/layout/Searchbar.tsx";
import parseOrderStatus from "../../utils/functions/parseOrderStatus.ts";

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
  const [displayedCategories, setDisplayedCategories] = useState<CategoryExpanded[]>([]);
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
    void fetchCategories();
    setMessage(message);
  };

  useEffect(() => {

    if (searchQuery === '' || searchQuery === null || searchQuery === undefined) {
      setDisplayedCategories(categories);
    } else {
      const filteredUsers = categories.filter( category =>
          parseOrderStatus(category.id_estado).toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.id_categoria.toString() === searchQuery
      )
      setDisplayedCategories(filteredUsers);
    }
  }, [searchQuery, categories]);

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
        <Searchbar label="Buscar por nombre, estado o ID" searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Button variant="contained" onClick={handleOpen}>
          <Add /> Añadir Categoria
        </Button>
      </Box>
      <CategoriesCRUDTable categories={displayedCategories} onUpdate={fetchCategories} />
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
