import React from "react";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/auth/AuthContext.tsx";
import { LoginPage } from "./pages/Auth/LoginPage.tsx";
import { ProtectedRouteGuard } from "./utils/guards/ProtectedRouteGuard.tsx";
import { NoEncontradoPage } from "./pages/NoEncontradoPage.tsx";
import { UserHomePage } from "./pages/User/UserHomePage.tsx";
import { CartProvider } from "./contexts/carrito/CartContext.tsx";
import { HistoryPage } from "./pages/User/HistoryPage.tsx";
import { VerifyRoleGuard } from "./utils/guards/VerifyRoleGuard.tsx";
import { Roles } from "./entities/RolesEnum.ts";
import UserLayout from "./components/layout/UserLayout.tsx";
import OperatorHomePage from "./pages/Operator/OperatorHomePage.tsx";
import Layout from "./components/layout/Layout.tsx";
import ProductsCRUDPage from "./pages/Operator/ProductsCRUDPage.tsx";
import CategoriesCRUDPage from "./pages/Operator/CategoriesCRUDPage.tsx";
import UserCRUDPage from "./pages/Operator/UserCRUDPage.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/usuario/*"
            element={
              <ProtectedRouteGuard>
                <VerifyRoleGuard authRole={Roles.USUARIO}>
                  <CartProvider>
                    <UserLayout>
                      <Routes>
                        <Route path="home" element={<UserHomePage />} />
                        <Route path="historial" element={<HistoryPage />} />
                      </Routes>
                    </UserLayout>
                  </CartProvider>
                </VerifyRoleGuard>
              </ProtectedRouteGuard>
            }
          />
          <Route
            path="/operador/*"
            element={
              <ProtectedRouteGuard>
                <VerifyRoleGuard authRole={Roles.OPERADOR}>
                  <Layout>
                    <Routes>
                      <Route path="home" element={<OperatorHomePage />} />
                      <Route path="productos" element={<ProductsCRUDPage />} />
                      <Route path="categorias" element={< CategoriesCRUDPage />} />
                      <Route path="usuarios" element={< UserCRUDPage />} />
                    </Routes>
                  </Layout>
                </VerifyRoleGuard>
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
