import { StrictMode } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import { QueryClient, QueryClientProvider } from "react-query";
import { CompanyProvider } from "./contexts/CompanyContext";
import { QueueProvider } from "./contexts/QueueContext";
import { ThemeContext } from "./contexts/ThemeContext";
import { I18nextProvider } from "react-i18next";
import i18n from "./services/translations/i18n";
import keycloak from "./services/keycloak/keycloak";
import Home from "./pages/Home";

export default function AppRoutes() {
  const queryClient = new QueryClient();

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: "login-required",
        checkLoginIframe: false,
      }}
    >
      <StrictMode>
        <Router>
          <QueryClientProvider client={queryClient}>
            <CompanyProvider>
              <QueueProvider>
                <ThemeContext>
                  <I18nextProvider i18n={i18n}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                    </Routes>
                    {/* <NavTab /> */}
                  </I18nextProvider>
                </ThemeContext>
              </QueueProvider>
            </CompanyProvider>
          </QueryClientProvider>
        </Router>
      </StrictMode>
    </ReactKeycloakProvider>
  );
}
