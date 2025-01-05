import React from "react";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider} from "./contexts/auth/AuthContext.tsx";
import { LoginPage } from "./pages/Auth/LoginPage.tsx";
import { ProtectedRouteGuard } from "./utils/guards/ProtectedRouteGuard.tsx";
import { NoEncontradoPage } from "./pages/NoEncontradoPage.tsx";
import { UsuarioHomePage } from "./pages/Usuario/UsuarioHomePage.tsx";
import {CartPage} from "./pages/Usuario/CartPage.tsx";
import {CartProvider} from "./contexts/carrito/CartContext.tsx";

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
                  <CartProvider>
                  <Routes>
                      <Route path="home" element={<UsuarioHomePage/>}/>
                      <Route path="carrito" element={<CartPage />}/>
                  </Routes>
                  </CartProvider>
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
