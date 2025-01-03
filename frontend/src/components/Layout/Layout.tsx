import { useContext } from "react";
import { AuthContext } from "../../contexts/Auth/AuthContext.tsx";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Roles } from "../../contexts/types/RolesEnum.ts";
import {
  BusinessCenter,
  Category,
  Group,
  Home,
  Inventory2,
  Restore,
} from "@mui/icons-material";

interface LayoutProps {
  renderNavbar: (elements: JSX.Element[]) => JSX.Element[];
  renderSidebar: (elements: JSX.Element[]) => JSX.Element[];
}

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

const getRolesNavbarList = (role: Roles | null) => {
  const userItems = [

  ]
}

const Layout: React.FC<LayoutProps> = ({ renderNavbar, renderSidebar }) => {
  const authContext = useContext(AuthContext);

  if (authContext?.role === null || authContext?.role === undefined) {
    throw new Error("No tienes acceso a este componente");
  }

  const sidebarItems = getRoleSidebarList(authContext.role);

  return (
    <List>
      {sidebarItems?.map((item) => (
        <ListItem key={item.key} component="a" href={item.link}>
          <ListItemButton>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
