import { makeStyles } from "@mui/styles";
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
import {
  RenderTableHeaderCell,
  TableHeader,
} from "../../utils/render/RenderTableHeader.tsx";
import UserExpanded from "../../entities/UserExpanded.ts";
import React, { useState } from "react";
import api from "../../utils/api.ts";
import ApiError from "../../contexts/types/ApiError.tsx";
import Button from "@mui/material/Button";
import { StatusEnum } from "../../entities/StatusEnum.ts";
import theme from "../../styles/theme.tsx";
import {AddCircle, RemoveCircle} from "@mui/icons-material";
import { formatDate } from "../../utils/functions/formatDate.ts";

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
  { label: "Nombre", align: "center" },
  { label: "Correo", align: "center" },
  { label: "Teléfono", align: "center" },
  { label: "Dirección", align: "center" },
  { label: "Fecha de nacimiento", align: "center" },
  { label: "Fecha de creación", align: "center" },
  { label: "Rol", align: "center" },
  { label: "Cliente", align: "center" },
  { label: "Estado", align: "center" },
  { label: "Bloquear o Desbloquear", align: "center" },
];

interface UserCRUDTableProps {
  users: UserExpanded[];
  onUpdate: () => void;
}

const UserCRUDTable: React.FC<UserCRUDTableProps> = ({ users, onUpdate }) => {
  const classes = useStyles();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOnClose = () => {
    setError(null);
    setMessage(null);
  };

  const handleDeactivate = async (id: number) => {
    if (id) {
      try {
        const response = await api.delete(`/usuarios/${id}`);
        if (response.status === 200) {
          onUpdate();
          setMessage("Usuario bloqueado con exito");
        } else {
          setError(
            "Error al intentar bloquear al usuario: " + response.statusText,
          );
        }
      } catch (error) {
        const apiError = error as ApiError;
        setError(apiError.message);
      }
    }
  };

  const handleActivate = async (id: number) => {
    if (id) {
      try {
        const response = await api.put(`/usuarios/activar/${id}`);
        if (response.status === 200) {
          onUpdate();
          setMessage("Usuario desbloqueado con exito");
        } else {
          setError(
              "Error al intentar desbloqueado al usuario: " + response.statusText,
          );
        }
      } catch (error) {
        const apiError = error as ApiError;
        setError(apiError.message);
      }
    }
  }

  return (
    <TableContainer
      component={Paper}
      elevation={5}
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
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <RenderTableHeaderCell cells={tableHeaders} />
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id_usuario}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{user.id_usuario} </TableCell>
              <TableCell align="center">
                {user.nombre} {user.apellido}
              </TableCell>
              <TableCell align="center">{user.correo}</TableCell>
              <TableCell align="center">{user.telefono}</TableCell>
              <TableCell align="center">
                {user.direccion
                  ? user.direccion
                  : "Entrega a dirección del cliente."}
              </TableCell>
              <TableCell align="center">
                {formatDate(user.fecha_nacimiento)}
              </TableCell>
              <TableCell align="center">
                {formatDate(user.fecha_creacion)}
              </TableCell>
              <TableCell align="center">{user.rol}</TableCell>
              <TableCell align="center">{user.cliente ? user.cliente : "Independiente"}</TableCell>
              <TableCell align="center">{user.estado}</TableCell>
              {user.id_estado === StatusEnum.ACTIVE && <TableCell align="center">
                <Button
                  variant="outlined"
                  sx={{
                    color: theme.palette.error.light,
                    "&.Mui-disabled": {
                      color: theme.palette.info.dark,
                    },
                  }}
                  onClick={() => handleDeactivate(user.id_usuario)}
                >
                  <RemoveCircle /> Desactivar
                </Button>
              </TableCell>
              }
              {user.id_estado === StatusEnum.INACTIVE && <TableCell align="center">
                <Button
                    variant="outlined"
                    sx={{
                      color: theme.palette.primary.light,
                      "&.Mui-disabled": {
                        color: theme.palette.info.dark,
                      },
                    }}
                    onClick={() => handleActivate(user.id_usuario)}
                >
                  <AddCircle /> Activar
                </Button>
              </TableCell>
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserCRUDTable;