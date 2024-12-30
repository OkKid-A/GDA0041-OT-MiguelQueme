import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import React from "react";
import { DevSupport } from "@react-buddy/ide-toolbox";
import { ComponentPreviews, useInitial } from "./dev";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#43DBA3",
    },
    secondary: {
      main: "#0091AD",
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DevSupport
      ComponentPreviews={ComponentPreviews}
      useInitialHook={useInitial}
    >
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </DevSupport>
  </React.StrictMode>,
);
