import React from "react";
import { useAuth } from "../../hooks/useAuth.ts";
import { Navigate } from "react-router-dom";

export const VerifyRoleGuard: React.FC<{ children: JSX.Element }> = (
  { children },
  authRole: number,
) => {
  const { role } = useAuth();

  if (role !== authRole) {
    return <Navigate to="/login" />;
  }

  return children;
};
