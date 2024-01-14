import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import { CompanyProvider } from "./components/App/CompanyContext.jsx";

import { MantineProvider, createTheme } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

const theme = createTheme({
  primaryColor: "violet",
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CompanyProvider>
        <MantineProvider defaultColorScheme="auto" theme={theme}>
          <ModalsProvider>
            <BrowserRouter>
              <Notifications />
              <App />
            </BrowserRouter>
          </ModalsProvider>
        </MantineProvider>
      </CompanyProvider>
    </AuthProvider>
  </React.StrictMode>
);
