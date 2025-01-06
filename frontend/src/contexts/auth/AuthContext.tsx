import React, { ReactNode, useState, createContext, useEffect } from "react";
import { AuthTokenType } from "../types/AuthTokenType.ts";
import { useNavigate } from "react-router-dom";
import { AuthContextType } from "../types/AuthContextType.ts";
import api from "../../utils/api.ts";
import { Roles } from "../../entities/RolesEnum.ts";
import ApiError from "../types/ApiError.tsx";

const AuthContext = createContext<AuthContextType | undefined>(undefined);
// Proveedor que manejara el estado de autenticacion
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<number | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Funcion para revisar si un token sigue siendo valido
  const revisarAuth = async () => {
    if (!token) {
      try {
        console.log("actual last token chekec " + token);
        const response = await api.get("/auth");
        if (response.status === 200) {
          console.log(response);
          const data = response.data as AuthTokenType;
          setToken(data.token);
          setRole(data.rol);
          console.log(data.rol);
        } else {
          console.error("No se encontro un token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error de autenticación ", error);
        navigate("/login");
      } finally {
        setLoading(false);
        setInitialized(true);
        console.log("Here is the first time that we have the token");
      }
    }
  };
  // useEffect se asegura de revisar que el token sea valido cada vez que entramos a una nueva ruta
  useEffect(() => {
    if (!initialized) {
      console.log("is not initialized");
      void revisarAuth();
    }
  }, []);

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
        console.log(role);
        switch (data.rol) {
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
      const apiError = error as ApiError;
      const errorMessage =
        apiError.message ?? "Error desconocido al iniciar sesión";
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setToken(null);
    document.cookie = "userToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"; //Borramos la cookie
    navigate("/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const authContextValue: AuthContextType = {
    token,
    role,
    login,
    logout,
    revisarAuth,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
