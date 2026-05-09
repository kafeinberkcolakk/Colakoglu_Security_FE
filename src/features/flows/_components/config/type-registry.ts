/** biome-ignore-all lint/style/useNamingConvention: registry keys mirror backend BPMN process keys */

import type { ComponentType } from "react";
import type { UseFormReturn } from "react-hook-form";
import { DbQueryConfigFields } from "@/features/flows/_components/config/db-query-config-fields";
import { FileSftpConfigFields } from "@/features/flows/_components/config/file-sftp-config-fields";
import { HttpRestConfigFields } from "@/features/flows/_components/config/http-rest-config-fields";
import { WebhookConfigFields } from "@/features/flows/_components/config/webhook-config-fields";
import type { FlowFormValues } from "@/features/flows/schemas/flow-schema";
import type { FlowId } from "@/features/flows/types/flow";

const DEFAULT_FETCH_SIZE = 100;
const DEFAULT_SFTP_PORT = 22;
const DEFAULT_INTERVAL_CRON = "0 */5 * * * *";

interface FieldsProps {
  form: UseFormReturn<FlowFormValues>;
}

interface FlowTypeEntry {
  Fields: ComponentType<FieldsProps> | ComponentType;
  defaultValues: () => FlowFormValues;
  labelKey: string;
}

function emptyBase() {
  return {
    description: "",
    enabled: true,
    name: "",
    natsSubject: "",
    secretIntent: "change" as const,
  };
}

export const flowTypeRegistry: Record<FlowId, FlowTypeEntry> = {
  db_query_collector: {
    defaultValues: () => ({
      ...emptyBase(),
      cronExpression: DEFAULT_INTERVAL_CRON,
      flowId: "db_query_collector",
      parameters: {
        fetchSize: DEFAULT_FETCH_SIZE,
        jdbcPassword: "",
        jdbcUrl: "",
        jdbcUser: "",
        sql: "",
      },
    }),
    Fields: DbQueryConfigFields,
    labelKey: "page.flows.types.db_query_collector",
  },
  file_sftp_collector: {
    defaultValues: () => ({
      ...emptyBase(),
      cronExpression: DEFAULT_INTERVAL_CRON,
      flowId: "file_sftp_collector",
      parameters: {
        sftpFilePattern: "",
        sftpHost: "",
        sftpMoveAfterDownload: true,
        sftpPassword: "",
        sftpPort: DEFAULT_SFTP_PORT,
        sftpProcessedDir: "",
        sftpRemoteDir: "",
        sftpUser: "",
      },
    }),
    Fields: FileSftpConfigFields,
    labelKey: "page.flows.types.http_rest_collector",
  },
  http_rest_collector: {
    defaultValues: () => ({
      ...emptyBase(),
      cronExpression: DEFAULT_INTERVAL_CRON,
      flowId: "http_rest_collector",
      parameters: {
        httpBody: null,
        httpHeaders: [],
        httpMethod: "GET",
        httpUrl: "",
      },
    }),
    Fields: HttpRestConfigFields,
    labelKey: "page.flows.types.http_rest_collector",
  },
  webhook_collector: {
    defaultValues: () => ({
      ...emptyBase(),
      cronExpression: null,
      flowId: "webhook_collector",
      parameters: { webhookSecret: "" },
    }),
    Fields: WebhookConfigFields,
    labelKey: "page.flows.types.webhook_collector",
  },
};

export function getTypeEntry(flowId: FlowId): FlowTypeEntry {
  return flowTypeRegistry[flowId];
}
