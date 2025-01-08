import React, { useState } from 'react';
import {
    Box,
    Button,
    Fade,
    Modal,
    Theme,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import theme from "../../styles/theme.tsx";
import { Order } from "../../entities/Order.ts";

const useStyles = makeStyles<Theme>((theme: Theme) => ({
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    modalContent: {
        backgroundColor: theme.palette.background.paper,
        border: `2px solid ${theme.palette.primary.main}`,
        padding: theme.spacing(3),
        borderRadius: theme.shape.borderRadius,
    },
}));

const OrderHistoryModal: React.FC<{ open: boolean; handleClose: () => void; orders: Order[] }> = ({ open, handleClose, orders }) => {
    const classes = useStyles();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredOrders = orders.filter(order =>
        order.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.direccion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
        >
            <Fade in={open}>
                <Box className={classes.modalContent}>
                    <Typography variant="h6" component="h2" mb={2}>
                        Historial de Ordenes
                    </Typography>
                    <TextField
                        label="Buscar"
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <Divider sx={{ margin: theme.spacing(2, 0) }} />
                    <List>
                        {filteredOrders.map(order => (
                            <ListItem key={order.id_orden}>
                                <ListItemText
                                    primary={`${order.nombre} ${order.apellido}`}
                                    secondary={`Dirección: ${order.direccion}`}
                                />
                                {/* Add any additional elements here */}
                            </ListItem>
                        ))}
                    </List>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: theme.spacing(1),
                            marginTop: theme.spacing(2),
                        }}
                    >
                        <Button onClick={handleClose} variant="outlined">
                            Cerrar
                        </Button>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};

export default OrderHistoryModal;
