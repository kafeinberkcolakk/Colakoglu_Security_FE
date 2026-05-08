import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { apiRoutes } from "@/lib/const/pages";

const UNAUTHORIZED_STATUS = 401;
const REFRESH_ENDPOINT = "/api/auth/refresh";

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshToken(): Promise<boolean> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = fetch(REFRESH_ENDPOINT, { method: "POST" })
    .then((response) => response.ok)
    .catch(() => false)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

function redirectToLogin(): void {
  if (typeof window === "undefined") {
    return;
  }

  const returnUrl = window.location.pathname + window.location.search;
  const loginUrl = `${apiRoutes.login}?returnUrl=${encodeURIComponent(returnUrl)}`;
  window.location.href = loginUrl;
}

export const fetcher = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

fetcher.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryableConfig | undefined;
    const status = error.response?.status;

    if (status === UNAUTHORIZED_STATUS && config && !config._retry) {
      config._retry = true;

      const refreshed = await tryRefreshToken();
      if (refreshed) {
        return fetcher.request(config);
      }

      redirectToLogin();
      if (typeof window !== "undefined") {
        return new Promise(() => {
          // Intentionally pending — redirect is in progress, suppress the 401 error.
        });
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);
