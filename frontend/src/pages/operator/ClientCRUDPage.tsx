import React, { useEffect, useState } from "react";
import {Alert, Box, Snackbar, Theme, Typography} from "@mui/material";
import { makeStyles } from "@mui/styles";
import api from "../../utils/api.ts";
import ApiError from "../../contexts/types/ApiError.tsx";
import theme from "../../styles/theme.tsx";
import { Add } from "@mui/icons-material";
import Button from "@mui/material/Button";
import {Client} from "../../entities/Client.ts";
import ClientCRUDTable from "../../components/client/ClientCRUDTable.tsx";
import ClientModal from "../../components/client/ClientModal.tsx";
import useActionsPage from "../../hooks/useActionsPage.ts";

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
    }
}));

const ClientCRUDPage: React.FC = () => {
    const classes = useStyles();
    const [clients, setClients] = useState<Client[]>([]);
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
        void fetchClients();
        setMessage(message);
    }

    const fetchClients = async () => {
        try {
            const response = await api.get("/clientes/");
            if (response.status === 200) {
                setClients(response.data as Client[]);
            } else {
                console.error(response.statusText);
                setError(response.statusText);
            }
        } catch (error) {
            const apiError = error as ApiError;
            setError(apiError.message);
        }
    };

    useEffect(() => {
        void fetchClients();
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
                    Clientes
                </Typography>
                <Button  variant="contained" onClick={handleOpen}>
                    <Add /> Añadir cliente
                </Button>
            </Box>
            <ClientCRUDTable clients={clients} onUpdate={fetchClients} />
            <ClientModal handleClose={handleClose} handleResult={handleResult} open={openModal} client={null}/>
        </Box>
    );
};

export default ClientCRUDPage;
