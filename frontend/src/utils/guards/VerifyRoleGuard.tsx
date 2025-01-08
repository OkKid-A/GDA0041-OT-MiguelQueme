import React, { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth.ts";
import { Navigate } from "react-router-dom";
import {Roles} from "../../entities/RolesEnum.ts";

export const VerifyRoleGuard: React.FC<{ children: ReactNode;   authRole: number, }> = (
  { children, authRole },
) => {
  const { role } = useAuth();

  if (role !== authRole) {
    if (role === Roles.USUARIO.valueOf()) {
      return <Navigate to="/usuario/home"/>
    } else if (role === Roles.OPERADOR.valueOf()){
      return <Navigate to="/operador/home"/>
    } else {
      return <Navigate to="/login" />;
    }
  }

  return children;
};
