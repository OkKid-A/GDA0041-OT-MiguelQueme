import React, { ReactNode, useState, createContext, useEffect } from "react";
import { AuthTokenType } from "../types/AuthTokenType.ts";
import { useNavigate } from "react-router-dom";
import { AuthContextType } from "../types/AuthContextType.ts";
import api from "../../utils/api.ts";
import { Roles } from "../types/RolesEnum.ts";

// Creamos el context con un valor indefinido por defecto para su inicialización
const AuthContext = createContext<AuthContextType | undefined>(undefined);
// Proveedor que manejara el estado de autenticacion
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<number | null>(null);
  const navigate = useNavigate();

  // useEffect se asegura de revisar que el token sea valido cada vez que entramos a una nueva ruta
  useEffect(() => {
    // Funcion para revisar si un token sigue siendo valido
    const revisarAuth = async () => {
      if (!token) {
        try {
          const response = await api.get("/auth");
          if (response.status === 200) {
            const data = response.data as AuthTokenType;
            setToken(data.token);
            setRole(data.rol);
          } else {
            console.error("No se encontro un token");
            navigate("/login");
          }
        } catch (error) {
          console.error("Error de autenticación ", error);
          navigate("/login");
        }
      }
    };
    console.log(token);
    // Para evitar redundancia, solo validamos sino estamos en el login
    void revisarAuth();
  }, [navigate]);

  const login = async (correo: string, password: string) => {
    try {
      // Obtenemos el token de la API
      const response = await api.post("/auth/login", {
        correo: correo,
        password: password,
      });
      if (response.status === 201) {
        const data = response.data as AuthTokenType;
        console.log(data);
        setToken(data.token); // Guardamos el token
        setRole(data.rol);
        switch (role) {
          // Redireccionamos segun el rol del usuario
          case Roles.OPERADOR:
            navigate("/operador/home");
            break;
          case Roles.USUARIO:
            navigate("/usuario/home");
            break;
          default:
            navigate("/login");
        }
      } else {
        console.error("Credenciales invalidas");
      }
    } catch (error) {
      console.error("Error al iniciar sesión", error);
    }
  };

  const logout = () => {
    setToken(null);
    document.cookie = "userToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"; //Borramos la cookie
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
