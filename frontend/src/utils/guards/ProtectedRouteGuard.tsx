import { useAuth } from "../../hooks/useAuth.ts";
import React, { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRouteGuard: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { token, revisarAuth } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const attemptAuth = async () => {
      setLoading(true);
      try {
        console.log("Attempt");
        await revisarAuth();
      } catch (error) {
        console.error("Error in auth check on protected route", error);
      } finally {
        setLoading(false);
      }
    };
    void attemptAuth();
  }, [revisarAuth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    console.log("should be last token checked" + token);
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <>{children}</>;
};
