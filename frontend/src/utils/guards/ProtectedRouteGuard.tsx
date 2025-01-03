import { useAuth } from "../../hooks/useAuth.ts";
import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRouteGuard: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};
