import { CssBaseline, ThemeProvider } from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import WidgetLibraryPlayground from "./widgetLibrary/WidgetLibraryPlayground";
import "./index.css";
import { ecpTheme } from "./theme/ecpTheme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={ecpTheme}>
      <CssBaseline />
      <WidgetLibraryPlayground />
    </ThemeProvider>
  </StrictMode>,
);
