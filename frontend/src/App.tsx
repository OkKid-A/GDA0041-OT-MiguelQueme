import React from "react";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/Auth/AuthContext.tsx";
import { LoginPage } from "./pages/Auth/LoginPage.tsx";
import { ProtectedRouteGuard } from "./utils/guards/ProtectedRouteGuard.tsx";
import { NoEncontradoPage } from "./pages/NoEncontradoPage.tsx";
import { UsuarioHomePage } from "./pages/UsuarioHomePage.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/usuario/home"
            element={
              <ProtectedRouteGuard>
                <UsuarioHomePage />
              </ProtectedRouteGuard>
            }
          />
          <Route path="*" element={<NoEncontradoPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
