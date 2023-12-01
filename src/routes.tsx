import { StrictMode } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "react-query";
import { ThemeContext } from "./services/theme/ThemeContext";
import { I18nextProvider } from "react-i18next";
import { alert } from "./store/signalsStore";
import i18n from "./services/translations/i18n";
import keycloak from "./services/auth/keycloak";
import Home from "./pages/Home";

export default function AppRoutes() {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error: any) => (alert.value = { error: error?.message }),
    }),
    mutationCache: new MutationCache({
      onError: (error: any) => (alert.value = { error: error?.message }),
    }),
  });

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
            <ThemeContext>
              <I18nextProvider i18n={i18n}>
                <Routes>
                  <Route path="/" element={<Home />} />
                </Routes>
              </I18nextProvider>
            </ThemeContext>
          </QueryClientProvider>
        </Router>
      </StrictMode>
    </ReactKeycloakProvider>
  );
}
