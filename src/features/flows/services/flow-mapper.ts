import type {
  FlowFormValues,
  HttpRestParamsFormValues,
} from "@/features/flows/schemas/flow-schema";
import { getNatsSubject } from "@/features/flows/services/flow-accessors";
import type {
  DbQueryParameters,
  FileSftpParameters,
  Flow,
  FlowId,
  HttpRestParameters,
  WebhookParameters,
} from "@/features/flows/types/flow";

const DEFAULT_SFTP_PORT = 22;

export interface CreateFlowRequest {
  cronExpression: string | null;
  description?: string;
  flowId: FlowId;
  name: string;
  parameters: Record<string, unknown>;
}

export type UpdateFlowRequest = CreateFlowRequest & { id: number };

function headersArrayToJson(
  headers: HttpRestParamsFormValues["httpHeaders"],
): string | undefined {
  const map: Record<string, string> = {};
  for (const { key, value } of headers) {
    if (key.trim() !== "") {
      map[key] = value;
    }
  }
  return Object.keys(map).length === 0 ? undefined : JSON.stringify(map);
}

function headersJsonToArray(
  raw: unknown,
): HttpRestParamsFormValues["httpHeaders"] {
  if (typeof raw !== "string" || raw.trim() === "") {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object") {
      return [];
    }
    return Object.entries(parsed as Record<string, unknown>).map(
      ([key, value]) => ({
        key,
        value: typeof value === "string" ? value : String(value),
      }),
    );
  } catch {
    return [];
  }
}

function buildParameters(form: FlowFormValues): Record<string, unknown> {
  if (form.flowId === "webhook_collector") {
    const params: WebhookParameters = {
      natsSubject: form.natsSubject,
    };
    if (
      form.secretIntent === "change" &&
      form.parameters.webhookSecret.trim() !== ""
    ) {
      params.webhookSecret = form.parameters.webhookSecret;
    }
    return { ...params };
  }

  if (form.flowId === "http_rest_collector") {
    const params: HttpRestParameters = {
      httpMethod: form.parameters.httpMethod,
      httpUrl: form.parameters.httpUrl,
      natsSubject: form.natsSubject,
    };
    const headersJson = headersArrayToJson(form.parameters.httpHeaders);
    if (headersJson !== undefined) {
      params.httpHeaders = headersJson;
    }
    if (form.parameters.httpBody !== null && form.parameters.httpBody !== "") {
      params.httpBody = form.parameters.httpBody;
    }
    return { ...params };
  }

  if (form.flowId === "db_query_collector") {
    const params: DbQueryParameters = {
      fetchSize: form.parameters.fetchSize,
      jdbcUrl: form.parameters.jdbcUrl,
      natsSubject: form.natsSubject,
      sql: form.parameters.sql,
    };
    if (form.parameters.jdbcUser.trim() !== "") {
      params.jdbcUser = form.parameters.jdbcUser;
    }
    if (
      form.secretIntent === "change" &&
      form.parameters.jdbcPassword.trim() !== ""
    ) {
      params.jdbcPassword = form.parameters.jdbcPassword;
    }
    return { ...params };
  }

  const params: FileSftpParameters = {
    natsSubject: form.natsSubject,
    sftpHost: form.parameters.sftpHost,
    sftpUser: form.parameters.sftpUser,
  };
  if (form.parameters.sftpPort > 0) {
    params.sftpPort = form.parameters.sftpPort;
  }
  if (
    form.secretIntent === "change" &&
    form.parameters.sftpPassword.trim() !== ""
  ) {
    params.sftpPassword = form.parameters.sftpPassword;
  }
  if (form.parameters.sftpRemoteDir.trim() !== "") {
    params.sftpRemoteDir = form.parameters.sftpRemoteDir;
  }
  if (form.parameters.sftpFilePattern.trim() !== "") {
    params.sftpFilePattern = form.parameters.sftpFilePattern;
  }
  if (form.parameters.sftpProcessedDir.trim() !== "") {
    params.sftpProcessedDir = form.parameters.sftpProcessedDir;
  }
  params.sftpMoveAfterDownload = form.parameters.sftpMoveAfterDownload;
  return { ...params };
}

export function toCreateRequest(form: FlowFormValues): CreateFlowRequest {
  return {
    cronExpression: form.cronExpression,
    description: form.description.trim() === "" ? undefined : form.description,
    flowId: form.flowId,
    name: form.name,
    parameters: buildParameters(form),
  };
}

export function toUpdateRequest(
  id: number,
  form: FlowFormValues,
): UpdateFlowRequest {
  return { ...toCreateRequest(form), id };
}

function pickString(params: Record<string, unknown>, key: string): string {
  const value = params[key];
  return typeof value === "string" ? value : "";
}

function pickNumber(
  params: Record<string, unknown>,
  key: string,
  fallback = 0,
): number {
  const value = params[key];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function pickBool(
  params: Record<string, unknown>,
  key: string,
  fallback: boolean,
): boolean {
  const value = params[key];
  return typeof value === "boolean" ? value : fallback;
}

export function toFormValues(flow: Flow): FlowFormValues {
  const baseValues = {
    description: flow.description ?? "",
    enabled: flow.enabled,
    name: flow.name,
    natsSubject: getNatsSubject(flow),
    secretIntent: "keep" as const,
  };

  if (flow.flowId === "webhook_collector") {
    return {
      ...baseValues,
      cronExpression: null,
      flowId: "webhook_collector",
      parameters: { webhookSecret: "" },
    };
  }

  if (flow.flowId === "http_rest_collector") {
    return {
      ...baseValues,
      cronExpression: flow.cronExpression,
      flowId: "http_rest_collector",
      parameters: {
        httpBody: pickString(flow.parameters, "httpBody") || null,
        httpHeaders: headersJsonToArray(flow.parameters.httpHeaders),
        httpMethod: (pickString(flow.parameters, "httpMethod") ||
          "GET") as HttpRestParamsFormValues["httpMethod"],
        httpUrl: pickString(flow.parameters, "httpUrl"),
      },
    };
  }

  if (flow.flowId === "db_query_collector") {
    return {
      ...baseValues,
      cronExpression: flow.cronExpression,
      flowId: "db_query_collector",
      parameters: {
        fetchSize: pickNumber(flow.parameters, "fetchSize", 1),
        jdbcPassword: "",
        jdbcUrl: pickString(flow.parameters, "jdbcUrl"),
        jdbcUser: pickString(flow.parameters, "jdbcUser"),
        sql: pickString(flow.parameters, "sql"),
      },
    };
  }

  return {
    ...baseValues,
    cronExpression: flow.cronExpression,
    flowId: "file_sftp_collector",
    parameters: {
      sftpFilePattern: pickString(flow.parameters, "sftpFilePattern"),
      sftpHost: pickString(flow.parameters, "sftpHost"),
      sftpMoveAfterDownload: pickBool(
        flow.parameters,
        "sftpMoveAfterDownload",
        true,
      ),
      sftpPassword: "",
      sftpPort: pickNumber(flow.parameters, "sftpPort", DEFAULT_SFTP_PORT),
      sftpProcessedDir: pickString(flow.parameters, "sftpProcessedDir"),
      sftpRemoteDir: pickString(flow.parameters, "sftpRemoteDir"),
      sftpUser: pickString(flow.parameters, "sftpUser"),
    },
  };
}
