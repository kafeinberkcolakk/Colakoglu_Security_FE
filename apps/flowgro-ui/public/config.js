// API_BASE_URL is empty so all Flowgro/api calls go through Vite's dev proxy
// (configured in vite.config.ts) → http://localhost:8180. This avoids CORS
// because the browser sees same-origin requests against http://localhost:3001.
// In production point this at the edge URL that fronts the backend.
window.API_BASE_URL = "";
window.KEYCLOAK_URL = "http://localhost:8081";
window.KEYCLOAK_REALM = "colakoglu_security";
window.KEYCLOAK_CLIENT_ID = "colakoglu_security-client";
