import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#43DBA3",
    },
    secondary: {
      main: "#0091AD",
    },
    info: {
      main: "#AF9AB2",
      dark: "#2B2D42",
    },
    background: {
      default: "#000000",
      paper: "rgb(0,20,35)",
    },
    text:{
      primary: "#ffffff",
      secondary: "#000000",
    },
    error: {
      main: "#de2828",
    },
    divider: "rgba(255,255,255,0.53)",
},
  spacing: 4,
});

export default theme;
