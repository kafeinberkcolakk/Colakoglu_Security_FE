import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  clientId: window.KEYCLOAK_CLIENT_ID,
  realm: window.KEYCLOAK_REALM,
  url: window.KEYCLOAK_URL,
});

export default keycloak;
