"use client";

import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type ConfigData = {
  apiGatewayUrl: string;
  appName: string;
  appVersion: string;
  authEnabled?: boolean;
};

type ConfigContextType = {
  config: ConfigData | null;
  error: Error | null;
  isLoading: boolean;
};

const configContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/config");
        if (!response.ok) {
          throw new Error(`Failed to load config: ${response.statusText}`);
        }

        setConfig(await response.json());
      } catch (nextError) {
        setError(
          nextError instanceof Error ? nextError : new Error("Unknown error"),
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchConfig();
  }, []);

  return (
    <configContext.Provider value={{ config, error, isLoading }}>
      {children}
    </configContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(configContext);
  if (!context) {
    throw new Error("useConfig must be used within ConfigProvider");
  }

  return context;
}
