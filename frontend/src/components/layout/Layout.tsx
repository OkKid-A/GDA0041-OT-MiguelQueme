import React, { ReactNode, useContext, useState } from "react";
import { AuthContext } from "../../contexts/auth/AuthContext.tsx";
import { CssBaseline } from "@mui/material";
import { Roles } from "../../contexts/types/RolesEnum.ts";
import {
  BusinessCenter,
  Category,
  Group,
  Home,
  Inventory2,
  Restore,
} from "@mui/icons-material";
import Sidebar from "./Sidebar.tsx";
import Navbar from "./Navbar.tsx";
import CartContext from "../../contexts/carrito/CartContext.tsx";

const getRoleSidebarList = (role: Roles | null) => {
  const userItems = [
    {
      key: "home-user",
      label: "Inicio",
      icon: <Home />,
      link: "/usuario/home",
    },
    {
      key: "history",
      label: "Historial",
      icon: <Restore />,
      link: "/usuario/historial",
    },
  ];

  const operadorItems = [
    {
      key: "home-user",
      label: "Inicio",
      icon: <Home />,
      link: "/operador/home",
    },
    {
      key: "products",
      label: "Productos",
      icon: <Inventory2 />,
      link: "/operador/productos",
    },
    {
      key: "categories",
      label: "Categorias",
      icon: <Category />,
      link: "/operador/categorias",
    },
    {
      key: "users",
      label: "Usuarios",
      icon: <Group />,
      link: "/operador/usuarios",
    },
    {
      key: "clients",
      label: "Clientes",
      icon: <BusinessCenter />,
      link: "/operador/clientes",
    },
  ];

  switch (role) {
    case Roles.USUARIO:
      return userItems;
    case Roles.OPERADOR:
      return operadorItems;
  }
};

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const authContext = useContext(AuthContext);
  const cartContext = useContext(CartContext);
  const [open, setOpen] = useState(false);
  const showCart = authContext?.role === Roles.USUARIO;
  const sidebarItems = getRoleSidebarList(authContext!.role);
  const toggleSidebar = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    authContext?.logout();
  };

  const handleCartClick = () => {
    cartContext?.setOpen(!cartContext?.open);
  };

  if (authContext?.role === null || authContext?.role === undefined) {
    throw new Error("No tienes acceso a este componente");
  }

  return (
    <div>
      <CssBaseline />
      <Navbar
        toggleSidebar={toggleSidebar}
        onLogout={handleLogout}
        onCartClick={showCart ? handleCartClick : handleCartClick}
        showCart={showCart}
      />
      <Sidebar
        open={open}
        toggleSidebar={toggleSidebar}
        sidebarItems={sidebarItems}
      />
      {children}
    </div>
  );
};

export default Layout;
