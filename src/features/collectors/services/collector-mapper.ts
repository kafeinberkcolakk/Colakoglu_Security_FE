import type {
  CollectorFormValues,
  HttpRestConfigFormValues,
} from "@/features/collectors/schemas/collector-schema";
import type {
  Collector,
  CollectorType,
  DbQueryConfig,
  FileSftpConfig,
  HttpRestConfig,
} from "@/features/collectors/types/collector";

export interface CollectorCreateRequest {
  config: string;
  enabled: boolean;
  intervalSeconds: number | null;
  name: string;
  natsSubject: string;
  secret: string | null;
  type: CollectorType;
}

export type CollectorUpdateRequest = Omit<CollectorCreateRequest, "secret"> & {
  secret?: string | null;
};

function headersArrayToRecord(
  headers: HttpRestConfigFormValues["headers"],
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const { key, value } of headers) {
    if (key.trim() !== "") {
      result[key] = value;
    }
  }
  return result;
}

function headersRecordToArray(
  headers: Record<string, string> | undefined,
): HttpRestConfigFormValues["headers"] {
  if (!headers) {
    return [];
  }
  return Object.entries(headers).map(([key, value]) => ({ key, value }));
}

function buildConfigPayload(form: CollectorFormValues): string {
  if (form.type === "WEBHOOK") {
    return "{}";
  }

  if (form.type === "HTTP_REST") {
    const payload: HttpRestConfig = {
      body: form.config.body ?? null,
      headers: headersArrayToRecord(form.config.headers),
      method: form.config.method,
      url: form.config.url,
    };
    return JSON.stringify(payload);
  }

  if (form.type === "DB_QUERY") {
    const payload: DbQueryConfig = {
      fetchSize: form.config.fetchSize,
      jdbcUrl: form.config.jdbcUrl,
      password: form.config.password,
      sql: form.config.sql,
      username: form.config.username,
    };
    return JSON.stringify(payload);
  }

  const payload: FileSftpConfig = {
    filePattern: form.config.filePattern,
    host: form.config.host,
    moveAfterDownload: form.config.moveAfterDownload,
    password: form.config.password,
    port: form.config.port,
    processedDir: form.config.processedDir ?? "",
    remoteDir: form.config.remoteDir,
    username: form.config.username,
  };
  return JSON.stringify(payload);
}

export function toCreateRequest(
  form: CollectorFormValues,
): CollectorCreateRequest {
  const trimmedSecret = (form.secret ?? "").trim();
  return {
    config: buildConfigPayload(form),
    enabled: form.enabled,
    intervalSeconds: form.intervalSeconds,
    name: form.name,
    natsSubject: form.natsSubject,
    secret: trimmedSecret === "" ? null : trimmedSecret,
    type: form.type,
  };
}

export function toUpdateRequest(
  form: CollectorFormValues,
): CollectorUpdateRequest {
  const base: CollectorUpdateRequest = {
    config: buildConfigPayload(form),
    enabled: form.enabled,
    intervalSeconds: form.intervalSeconds,
    name: form.name,
    natsSubject: form.natsSubject,
    type: form.type,
  };

  if (form.secretIntent === "keep") {
    return base;
  }

  const trimmedSecret = (form.secret ?? "").trim();
  return {
    ...base,
    secret: trimmedSecret === "" ? null : trimmedSecret,
  };
}

function parseConfigOrEmpty<T>(rawConfig: string): T {
  try {
    return JSON.parse(rawConfig) as T;
  } catch {
    return {} as T;
  }
}

export function toFormValues(collector: Collector): CollectorFormValues {
  const baseValues = {
    enabled: collector.enabled,
    name: collector.name,
    natsSubject: collector.natsSubject,
    secret: "",
    secretIntent: "keep" as const,
  };

  if (collector.type === "WEBHOOK") {
    return {
      ...baseValues,
      config: {},
      intervalSeconds: null,
      type: "WEBHOOK",
    };
  }

  if (collector.type === "HTTP_REST") {
    const config = parseConfigOrEmpty<HttpRestConfig>(collector.config);
    return {
      ...baseValues,
      config: {
        body: config.body ?? null,
        headers: headersRecordToArray(config.headers),
        method: (config.method ?? "GET") as HttpRestConfigFormValues["method"],
        url: config.url ?? "",
      },
      intervalSeconds: collector.intervalSeconds ?? 0,
      type: "HTTP_REST",
    };
  }

  if (collector.type === "DB_QUERY") {
    const config = parseConfigOrEmpty<DbQueryConfig>(collector.config);
    return {
      ...baseValues,
      config: {
        fetchSize: config.fetchSize ?? 0,
        jdbcUrl: config.jdbcUrl ?? "",
        password: config.password ?? "",
        sql: config.sql ?? "",
        username: config.username ?? "",
      },
      intervalSeconds: collector.intervalSeconds ?? 0,
      type: "DB_QUERY",
    };
  }

  const config = parseConfigOrEmpty<FileSftpConfig>(collector.config);
  return {
    ...baseValues,
    config: {
      filePattern: config.filePattern ?? "",
      host: config.host ?? "",
      moveAfterDownload: config.moveAfterDownload ?? true,
      password: config.password ?? "",
      port: config.port ?? 0,
      processedDir: config.processedDir ?? "",
      remoteDir: config.remoteDir ?? "",
      username: config.username ?? "",
    },
    intervalSeconds: collector.intervalSeconds ?? 0,
    type: "FILE_SFTP",
  };
}
