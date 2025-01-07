import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Theme,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import React from "react";
import theme from "../../styles/theme.tsx";
import {Link} from "react-router-dom";

const useStyles = makeStyles<Theme>((theme: Theme) => ({
  sidebarDrawer: {
  "& .MuiDrawer-paper": {
    backgroundColor: theme.palette.background.paper,
  }
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  sideBarIcon:{
    "& svg":{
      color: theme.palette.text.primary,
    }
  }
}));

interface SidebarProps {
  sidebarItems?: {
    key: string;
    label: string;
    icon: JSX.Element;
    link: string;
  }[];
  open: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarItems,
  open,
  toggleSidebar,
}) => {
  const classes = useStyles();

  return (
    <Box sx={{ display: "flex"}}>
      <Drawer
        variant="temporary"
        anchor="left"
        open={open}
        onClose={toggleSidebar}
        className={classes.sidebarDrawer}
      >
        <div className={classes.drawerHeader}>
          <Typography
            variant="h6"
            className={classes.title}
            paddingLeft={theme.spacing(2)}
          >
            Mi Tiendita Online
          </Typography>
          <IconButton sx={{color: theme.palette.text.primary}} onClick={toggleSidebar}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider color={theme.palette.divider} />
        <List>
          {sidebarItems?.map((item) => (
            <ListItem key={item.key} component={Link} to={item.link} >
              <ListItemButton>
                <ListItemIcon className={classes.sideBarIcon}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText sx={{color: theme.palette.text.primary}} primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
