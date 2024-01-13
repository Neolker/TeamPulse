import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "@mantine/core/styles.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";

import { MantineProvider, createTheme } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";

const theme = createTheme({
  primaryColor: "violet",
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <MantineProvider defaultColorScheme="auto" theme={theme}>
        <ModalsProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ModalsProvider>
      </MantineProvider>
    </AuthProvider>
  </React.StrictMode>
);
