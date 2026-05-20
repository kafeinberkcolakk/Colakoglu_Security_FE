import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContext } from "auth/authProvider";

interface UserInfo {
  groupPaths?: string[];
  username?: string;
  [key: string]: unknown;
}

interface UserInfoContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
  userInfo: UserInfo;
}

export const UserInfoContext = createContext<UserInfoContextType>({
  loading: false,
  setLoading: () => null,
  setUserInfo: () => null,
  userInfo: {},
});

interface JwtPayload {
  preferred_username?: string;
  username?: string;
  sub?: string;
  groups?: string[];
  [key: string]: unknown;
}

function base64UrlDecode(segment: string): string {
  const padded = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padding = padded.length % 4 === 0 ? 0 : 4 - (padded.length % 4);
  return atob(padded + "=".repeat(padding));
}

function decodeJwt(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }
  try {
    return JSON.parse(base64UrlDecode(parts[1])) as JwtPayload;
  } catch {
    return null;
  }
}

function extractUserInfo(token: string | undefined): UserInfo {
  if (!token) {
    return {};
  }
  const payload = decodeJwt(token);
  if (!payload) {
    return {};
  }
  return {
    ...payload,
    groupPaths: Array.isArray(payload.groups) ? payload.groups : undefined,
    username:
      payload.preferred_username ?? payload.username ?? payload.sub ?? undefined,
  };
}

export const UserInfoProvider = ({ children }: { children: ReactNode }) => {
  const authContext = useContext(AuthContext);
  const token = authContext?.keycloak.token;
  const [userInfo, setUserInfo] = useState<UserInfo>(() =>
    extractUserInfo(token),
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUserInfo(extractUserInfo(token));
  }, [token]);

  return (
    <UserInfoContext.Provider
      value={{ loading, setLoading, setUserInfo, userInfo }}
    >
      {children}
    </UserInfoContext.Provider>
  );
};
