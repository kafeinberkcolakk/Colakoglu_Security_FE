"use client";

import { useTranslations } from "next-intl";
import { useConfig } from "@/components/providers/config-provider";
import { useFlowgroToken } from "@/features/flowgro/auth/use-flowgro-token";

const TRAILING_SLASH = /\/+$/;

interface FlowgroIframeProps {
  path: string;
  title: string;
}

function buildIframeUrl(
  baseUrl: string,
  path: string,
  token: string | null,
): string {
  const trimmedBase = baseUrl.replace(TRAILING_SLASH, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const fullPath = trimmedBase + normalizedPath;
  if (!token) {
    return fullPath;
  }
  const separator = fullPath.includes("?") ? "&" : "?";
  return `${fullPath}${separator}token=${encodeURIComponent(token)}`;
}

export function FlowgroIframe({ path, title }: FlowgroIframeProps) {
  const t = useTranslations("page.flowgro");
  const { config, error: configError, isLoading: configLoading } = useConfig();
  const {
    error: tokenError,
    isLoading: tokenLoading,
    token,
  } = useFlowgroToken();

  // Config is non-negotiable — without flowgroUiUrl the iframe URL cannot
  // be built. Token, however, is best-effort: when it is missing, the Vite
  // app falls back to its own `login-required` flow.
  if (configLoading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-sm text-muted-foreground">
        <div>{t("loading")}</div>
        <div className="text-xs">
          config: loading · token: {tokenLoading ? "loading" : "ready"}
        </div>
      </div>
    );
  }

  if (configError || !config?.flowgroUiUrl) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-sm text-destructive">
        <div>{t("missingConfig")}</div>
        {configError ? (
          <div className="text-xs">{configError.message}</div>
        ) : null}
      </div>
    );
  }

  const iframeUrl = buildIframeUrl(config.flowgroUiUrl, path, token);

  return (
    <div className="flex h-full w-full flex-col">
      {tokenError ? (
        <div className="border-b border-destructive/40 bg-destructive/10 px-3 py-1 text-xs text-destructive">
          {tokenError.message}
        </div>
      ) : null}
      <iframe
        allow="clipboard-read; clipboard-write; fullscreen"
        className="h-full w-full flex-1 border-0"
        src={iframeUrl}
        title={title}
      />
    </div>
  );
}
