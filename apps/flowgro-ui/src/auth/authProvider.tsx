import { Spin } from "antd";
import type Keycloak from "keycloak-js";
import {
  createContext,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import keycloak from "./keycloak";

const INIT_TIMEOUT_MS = 15000;

interface AuthContextProps {
  initialized: boolean;
  isAuthenticated: boolean;
  keycloak: Keycloak;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined,
);

type InitStatus =
  | "starting"
  | "token-handoff"
  | "loading-userinfo"
  | "redirect-to-login"
  | "ready"
  | "error"
  | "timeout";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [status, setStatus] = useState<InitStatus>("starting");
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  useEffect(() => {
    let didTimeout = false;
    const timer = setTimeout(() => {
      didTimeout = true;
      setStatus("timeout");
      setErrorDetail(
        `Keycloak init did not respond within ${INIT_TIMEOUT_MS}ms — check that ${window.KEYCLOAK_URL} is reachable and that this origin is in the realm's Web Origins.`,
      );
      setInitialized(true);
      setAuthenticated(false);
    }, INIT_TIMEOUT_MS);

    const initializeKeycloak = async () => {
      try {
        if (keycloak.token) {
          setStatus("token-handoff");
          setAuthenticated(true);
          setInitialized(true);
          try {
            setStatus("loading-userinfo");
            await keycloak.loadUserInfo();
            if (!didTimeout) {
              setStatus("ready");
            }
          } catch (err) {
            setStatus("error");
            setErrorDetail(
              `loadUserInfo failed: ${err instanceof Error ? err.message : String(err)}`,
            );
            keycloak.logout();
          }
          return;
        }

        setStatus("redirect-to-login");
        const auth = await keycloak.init({
          checkLoginIframe: false,
          onLoad: "login-required",
        });
        if (didTimeout) {
          return;
        }

        setAuthenticated(auth);
        setInitialized(true);
        setStatus(auth ? "ready" : "error");

        if (auth) {
          keycloak.onTokenExpired = () => {
            keycloak.updateToken(60).catch(() => keycloak.logout());
          };
        }
      } catch (error) {
        setStatus("error");
        setErrorDetail(
          error instanceof Error ? error.message : String(error),
        );
        setInitialized(true);
        setAuthenticated(false);
      } finally {
        clearTimeout(timer);
      }
    };

    initializeKeycloak();

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (keycloak.authenticated) {
        keycloak.updateToken(60).catch(() => keycloak.logout());
      }
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  const logout = () => keycloak.logout();

  return (
    <AuthContext.Provider
      value={{ initialized, isAuthenticated: authenticated, keycloak, logout }}
    >
      {initialized ? (
        children
      ) : (
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            height: "100vh",
            justifyContent: "center",
            padding: 24,
            textAlign: "center",
            width: "100%",
          }}
        >
          <Spin size="large" />
          <div style={{ fontSize: 13, color: "#666", maxWidth: 600 }}>
            <div>Status: <strong>{status}</strong></div>
            <div>Token from URL: {keycloak.token ? "yes" : "no"}</div>
            <div>Keycloak URL: {window.KEYCLOAK_URL}</div>
            <div>Realm: {window.KEYCLOAK_REALM}</div>
            {errorDetail ? (
              <div style={{ color: "#d4380d", marginTop: 12 }}>
                {errorDetail}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};
