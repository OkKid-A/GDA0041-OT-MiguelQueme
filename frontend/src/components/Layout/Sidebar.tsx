import {Box, Divider, Drawer, IconButton, List, Theme} from "@mui/material";
import { useState } from "react";
import { makeStyles } from "@mui/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const useStyles = makeStyles<Theme>((theme: Theme) => ({
  appBar: {},
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    }
}));

const userSidebarList = {
    
}

const Sidebar: React.FC = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const openSidebar = () => () => {
    setOpen(true);
  };

  const closeSidebar = () => () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer variant="temporary" anchor="left">
        <div className={classes.drawerHeader}>
          <IconButton onClick={closeSidebar}>
              <ChevronLeftIcon/>
          </IconButton>
        </div>
          <Divider />
        <List>

        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
