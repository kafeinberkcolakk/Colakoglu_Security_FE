// Flow domain types — aligned with FE_DASHBOARD_API.md.
// `flowId` is the BPMN process key (collector kind). Old-shape `type: FlowType` removed.

export const FLOW_IDS = [
  "http_rest_collector",
  "db_query_collector",
  "file_sftp_collector",
  "webhook_collector",
] as const;

export type FlowId = (typeof FLOW_IDS)[number];

export const RUN_TRIGGER_TYPES = ["SCHEDULE", "WEBHOOK", "MANUAL"] as const;

export type RunTriggerType = (typeof RUN_TRIGGER_TYPES)[number];

export interface Flow {
  code: string;
  createDate: string;
  createdBy: string | null;
  cronExpression: string | null;
  deleted: boolean;
  description: string | null;
  enabled: boolean;
  flowId: FlowId;
  id: number;
  modifiedBy: string | null;
  modifyDate: string;
  name: string;
  parameters: Record<string, unknown>;
}

export interface FlowList {
  items: Flow[];
  limit: number;
  offset: number;
  total: number;
}

export interface FlowListQuery {
  flowId?: FlowId;
  includeDeleted?: boolean;
  limit?: number;
  name?: string;
  offset?: number;
}

export interface FlowRun {
  collectorId: string;
  completedAt: string | null;
  durationMs: number | null;
  errorMessage: string | null;
  id: string;
  messagesPublished: number;
  startedAt: string;
  success: boolean;
  triggerType: RunTriggerType;
}

// ---- Per-flowId parameter shapes (FE_DASHBOARD_API.md §6.4) ----

export interface HttpRestParameters {
  httpBody?: string | null;
  httpHeaders?: string;
  httpMethod?: "GET" | "POST" | "PUT" | "DELETE";
  httpUrl: string;
  natsSubject: string;
}

export interface DbQueryParameters {
  fetchSize?: number;
  jdbcPassword?: string;
  jdbcUrl: string;
  jdbcUser?: string;
  natsSubject: string;
  sql: string;
}

export interface FileSftpParameters {
  natsSubject: string;
  sftpFilePattern?: string;
  sftpHost: string;
  sftpMoveAfterDownload?: boolean;
  sftpPassword?: string;
  sftpPort?: number;
  sftpProcessedDir?: string;
  sftpRemoteDir?: string;
  sftpUser: string;
}

export interface WebhookParameters {
  natsSubject: string;
  webhookSecret?: string;
}

export type FlowParameters =
  | { flowId: "db_query_collector"; parameters: DbQueryParameters }
  | { flowId: "file_sftp_collector"; parameters: FileSftpParameters }
  | { flowId: "http_rest_collector"; parameters: HttpRestParameters }
  | { flowId: "webhook_collector"; parameters: WebhookParameters };
