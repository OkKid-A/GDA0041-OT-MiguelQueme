import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import React from "react";
import {ThemeProvider} from "@mui/material";
import theme from "./styles/theme.tsx";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
