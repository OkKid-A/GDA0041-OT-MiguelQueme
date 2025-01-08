import React, { useState } from "react";
import {
  Alert,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
} from "@mui/material";
import theme from "../../styles/theme.tsx";
import { StatusEnum } from "../../entities/StatusEnum.ts";
import Button from "@mui/material/Button";
import { Edit, RemoveCircle } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import api from "../../utils/api.ts";
import ApiError from "../../contexts/types/ApiError.tsx";
import ClientModal from "./ClientModal.tsx";
import { Client } from "../../entities/Client.ts";
import {
  RenderTableHeaderCell,
  TableHeader,
} from "../../utils/render/RenderTableHeader.tsx";

const useStyles = makeStyles<Theme>((theme: Theme) => ({
  tableContainer: {
    maxWidth: "90%",
    maxHeight: 800,
    margin: theme.spacing(2, "auto"),
    borderRadius: 5,
  },
  tableHeader: {
    color: theme.palette.text.secondary,
    flexGrow: 2,
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  tableHeaderCell: {
    backgroundColor: `${theme.palette.primary.main} !important`,
    color: `${theme.palette.text.secondary} !important`,
    fontWeight: "bold !important",
  },
}));

const tableHeaders: TableHeader[] = [
  { label: "ID", align: "left" },
  { label: "Nombre comercial", align: "center" },
  { label: "Razón social", align: "center" },
  { label: "Correo empresarial", align: "center" },
  { label: "Dirección de entrega", align: "center" },
  { label: "Teléfono empresarial", align: "center" },
  { label: "Estado", align: "center" },
    { label: "Editar", align: "center" },
    { label: "Desactivar", align: "center" },
];

interface ClientCRUDTableProps {
  clients: Client[];
  onUpdate: () => void;
}

const ClientCRUDTable: React.FC<ClientCRUDTableProps> = ({
  clients,
  onUpdate,
}) => {
  const classes = useStyles();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [focusedClient, setfocusedClient] = useState<Client | null>(null);

  const handleOnClose = () => {
    setError(null);
    setMessage(null);
  };

  const handleClose = () => {
    setOpenModal(false);
    setfocusedClient(null);
  };

  const handleResultMessage = (message: string) => {
    onUpdate();
    setMessage(message);
  };

  const handleDeactivate = async (id: number) => {
    if (id) {
      try {
        const response = await api.delete(`/clientes/${id}`);
        if (response.status === 200) {
          onUpdate();
          setMessage("Orden desactivada con exito");
        } else {
          setError(
            "Error al intentar desactivar el cliento: " + response.statusText,
          );
        }
      } catch (error) {
        const apiError = error as ApiError;
        setError(apiError.message);
      }
    }
  };

  const handleEdit = (client: Client) => {
    setfocusedClient(client);
    setOpenModal(true);
  };

  return (
    <TableContainer
      component={Paper}
      elevation={3}
      className={classes.tableContainer}
    >
      <Snackbar
        open={!!message}
        onClose={handleOnClose}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success">{message}</Alert>
      </Snackbar>
      <Snackbar
        open={!!error}
        onClose={handleOnClose}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      <Table stickyHeader={true}>
        <TableHead>
          <TableRow>
            <RenderTableHeaderCell cells={tableHeaders} />
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((client) => (
            <TableRow
              key={client.id_cliente}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{client.id_cliente}</TableCell>
              <TableCell align="right">{client.nombre_comercial}</TableCell>
              <TableCell align="right">{client.razon_social}</TableCell>
              <TableCell align="right">{client.correo_empresarial}</TableCell>
              <TableCell align="center">{client.direccion_entrega}</TableCell>
              <TableCell align="center">
                {client.telefono_empresarial}
              </TableCell>
              <TableCell align="right">
                {client.id_estado === StatusEnum.ACTIVE
                  ? "Activo"
                  : "Bloqueado"}
              </TableCell>
              <TableCell align="center">
                <Button
                  variant="outlined"
                  disabled={client.id_estado === StatusEnum.INACTIVE}
                  sx={{
                    color: theme.palette.primary.light,
                    "&.Mui-disabled": {
                      color: theme.palette.info.dark,
                    },
                  }}
                  onClick={() => handleEdit(client)}
                >
                  <Edit /> Editar
                </Button>
              </TableCell>
              <TableCell align="center">
                <Button
                  variant="outlined"
                  disabled={client.id_estado === StatusEnum.INACTIVE}
                  sx={{
                    color: theme.palette.error.light,
                    "&.Mui-disabled": {
                      color: theme.palette.info.dark,
                    },
                  }}
                  onClick={() => handleDeactivate(client.id_cliente)}
                >
                  <RemoveCircle /> Desactivar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ClientModal
        open={openModal}
        handleClose={handleClose}
        client={focusedClient}
        handleResult={handleResultMessage}
      />
    </TableContainer>
  );
};

export default ClientCRUDTable;
