/** biome-ignore-all lint/style/useNamingConvention: registry keys mirror backend enum literals */

import type { ComponentType } from "react";
import type { UseFormReturn } from "react-hook-form";
import { DbQueryConfigFields } from "@/features/collectors/_components/config/db-query-config-fields";
import { FileSftpConfigFields } from "@/features/collectors/_components/config/file-sftp-config-fields";
import { HttpRestConfigFields } from "@/features/collectors/_components/config/http-rest-config-fields";
import { WebhookConfigFields } from "@/features/collectors/_components/config/webhook-config-fields";
import type { CollectorFormValues } from "@/features/collectors/schemas/collector-schema";
import type { CollectorType } from "@/features/collectors/types/collector";

const DEFAULT_HTTP_INTERVAL_SECONDS = 300;
const DEFAULT_DB_INTERVAL_SECONDS = 300;
const DEFAULT_SFTP_INTERVAL_SECONDS = 300;
const DEFAULT_FETCH_SIZE = 100;
const DEFAULT_SFTP_PORT = 22;

interface FieldsProps {
  form: UseFormReturn<CollectorFormValues>;
}

interface CollectorTypeEntry {
  Fields: ComponentType<FieldsProps> | ComponentType;
  defaultValues: () => CollectorFormValues;
  labelKey: string;
}

function emptyBase() {
  return {
    enabled: true,
    name: "",
    natsSubject: "",
    secret: "",
    secretIntent: "change" as const,
  };
}

export const collectorTypeRegistry: Record<CollectorType, CollectorTypeEntry> =
  {
    DB_QUERY: {
      defaultValues: () => ({
        ...emptyBase(),
        config: {
          fetchSize: DEFAULT_FETCH_SIZE,
          jdbcUrl: "",
          password: "",
          sql: "",
          username: "",
        },
        intervalSeconds: DEFAULT_DB_INTERVAL_SECONDS,
        type: "DB_QUERY",
      }),
      Fields: DbQueryConfigFields,
      labelKey: "page.collectors.types.DB_QUERY",
    },
    FILE_SFTP: {
      defaultValues: () => ({
        ...emptyBase(),
        config: {
          filePattern: "",
          host: "",
          moveAfterDownload: true,
          password: "",
          port: DEFAULT_SFTP_PORT,
          processedDir: "",
          remoteDir: "",
          username: "",
        },
        intervalSeconds: DEFAULT_SFTP_INTERVAL_SECONDS,
        type: "FILE_SFTP",
      }),
      Fields: FileSftpConfigFields,
      labelKey: "page.collectors.types.FILE_SFTP",
    },
    HTTP_REST: {
      defaultValues: () => ({
        ...emptyBase(),
        config: {
          body: null,
          headers: [],
          method: "GET",
          url: "",
        },
        intervalSeconds: DEFAULT_HTTP_INTERVAL_SECONDS,
        type: "HTTP_REST",
      }),
      Fields: HttpRestConfigFields,
      labelKey: "page.collectors.types.HTTP_REST",
    },
    WEBHOOK: {
      defaultValues: () => ({
        ...emptyBase(),
        config: {},
        intervalSeconds: null,
        type: "WEBHOOK",
      }),
      Fields: WebhookConfigFields,
      labelKey: "page.collectors.types.WEBHOOK",
    },
  };

export function getTypeEntry(type: CollectorType): CollectorTypeEntry {
  return collectorTypeRegistry[type];
}
