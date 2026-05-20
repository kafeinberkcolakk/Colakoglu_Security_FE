import { AuthProvider } from "auth/authProvider";
import keycloak from "auth/keycloak";
import { UserInfoProvider } from "context/userInfoContext";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import i18n from "./i18n/i18n";

// DSR-style token handoff (FLOWGRO_UI_IMPLEMENTATION.md §22): when the host
// app opens us inside an iframe, it passes its Keycloak access token via
// `?token=...`. We inject it into the Keycloak instance before AuthProvider
// boots so the redirect-to-login flow is skipped for the embedded session.
const urlParams = new URLSearchParams(location.search);
const rawToken = urlParams.get("token");
const tokenFromUrl = rawToken ? decodeURIComponent(rawToken) : null;

if (tokenFromUrl) {
  keycloak.token = tokenFromUrl;
  keycloak.authenticated = true;
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <UserInfoProvider>
            <App />
            <Toaster position="top-center" />
          </UserInfoProvider>
        </AuthProvider>
      </I18nextProvider>
    </BrowserRouter>
  </StrictMode>,
);
