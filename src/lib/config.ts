/** biome-ignore-all lint/style/noProcessEnv: config access */
/** biome-ignore-all lint/correctness/noProcessGlobal: config access */

const FALLBACK_SESSION_HASH =
  "development-session-password-at-least-32-characters";

export const BE_API_URL = process.env.BE_API_URL ?? "";
export const ORIGIN = process.env.ORIGIN;
export const SESSION_HASH = process.env.SESSION_HASH ?? FALLBACK_SESSION_HASH;
export const KEYCLOAK_URL = process.env.KEYCLOAK_URL;
export const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID;
export const KEYCLOAK_AUDIENCE = process.env.KEYCLOAK_AUDIENCE;
export const KEYCLOAK_SCOPE = process.env.KEYCLOAK_SCOPE ?? "openid";
export const USE_SECURE_COOKIE = process.env.USE_SECURE_COOKIE === "true";
export const FLOWGRO_UI_URL =
  process.env.FLOWGRO_UI_URL ?? "http://localhost:3001";

export const isAuthEnabled = Boolean(KEYCLOAK_URL && KEYCLOAK_CLIENT_ID);

export function getKeycloakConfig(baseUrl: URL) {
  if (!isAuthEnabled || !KEYCLOAK_URL || !KEYCLOAK_CLIENT_ID) {
    return null;
  }

  const origin = ORIGIN ?? baseUrl.toString();
  const callbackUrl = new URL("/api/auth/callback", origin).toString();

  return {
    audience: KEYCLOAK_AUDIENCE ?? "",
    callbackUrl,
    clientId: KEYCLOAK_CLIENT_ID,
    scope: KEYCLOAK_SCOPE,
    tokenEndpoint: `${KEYCLOAK_URL}/protocol/openid-connect/token`,
    url: KEYCLOAK_URL,
  };
}
