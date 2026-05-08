export const COLLECTOR_TYPES = [
  "WEBHOOK",
  "HTTP_REST",
  "DB_QUERY",
  "FILE_SFTP",
] as const;

export type CollectorType = (typeof COLLECTOR_TYPES)[number];

export const RUN_TRIGGER_TYPES = ["SCHEDULE", "WEBHOOK", "MANUAL"] as const;

export type RunTriggerType = (typeof RUN_TRIGGER_TYPES)[number];

export interface Collector {
  config: string;
  createdAt: string;
  enabled: boolean;
  hasSecret: boolean;
  id: string;
  intervalSeconds: number | null;
  name: string;
  natsSubject: string;
  type: CollectorType;
  updatedAt: string;
}

export interface CollectorRun {
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

export interface WebhookConfig {
  // Empty body — webhooks are pushed by external systems.
  [key: string]: never;
}

export interface HttpRestConfig {
  body?: string | null;
  headers?: Record<string, string>;
  method?: string;
  url: string;
}

export interface DbQueryConfig {
  fetchSize?: number;
  jdbcUrl: string;
  password: string;
  sql: string;
  username: string;
}

export interface FileSftpConfig {
  filePattern: string;
  host: string;
  moveAfterDownload?: boolean;
  password: string;
  port?: number;
  processedDir?: string;
  remoteDir: string;
  username: string;
}

export type CollectorTypedConfig =
  | { type: "DB_QUERY"; config: DbQueryConfig }
  | { type: "FILE_SFTP"; config: FileSftpConfig }
  | { type: "HTTP_REST"; config: HttpRestConfig }
  | { type: "WEBHOOK"; config: WebhookConfig };
