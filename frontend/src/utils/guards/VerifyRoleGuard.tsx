import React, { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth.ts";
import { Navigate } from "react-router-dom";

export const VerifyRoleGuard: React.FC<{ children: ReactNode;   authRole: number, }> = (
  { children, authRole },
) => {
  const { role } = useAuth();

  if (role !== authRole) {
    return <Navigate to="/login" />;
  }

  return children;
};
