import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#43DBA3",
    },
    secondary: {
      main: "#0091AD",
    },
    background: {
      default: "#000000",
      paper: "rgb(0,27,46)",
    },
    text:{
      primary: "#ffffff",
      secondary: "#000000",
    },
    error: {
      main: "#de2828",
    },
  },
  spacing: 4,
});

export default theme;
