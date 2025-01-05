import { useContext } from "react";
import { AuthContext } from "../contexts/auth/AuthContext.tsx";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "El contexto de autenticación ha presentado un error.",
    );
  }

  return context;
};
