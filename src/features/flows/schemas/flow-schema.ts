import { z } from "zod";

const NAME_MAX_LENGTH = 200;
const NATS_SUBJECT_MAX_LENGTH = 200;
const DESCRIPTION_MAX_LENGTH = 500;
const SECRET_MAX_LENGTH = 200;
const CRON_MAX_LENGTH = 100;

const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE"] as const;

const requiredString = (max?: number) => {
  let schema = z.string().min(1, { message: "validation.required" });
  if (max !== undefined) {
    schema = schema.max(max, { message: "validation.tooLong" });
  }
  return schema;
};

const KeyValuePairSchema = z.object({
  key: z.string().min(1, { message: "validation.required" }),
  value: z.string(),
});

export const WebhookParamsFormSchema = z.object({
  webhookSecret: z.string().max(SECRET_MAX_LENGTH),
});

export const HttpRestParamsFormSchema = z.object({
  httpBody: z.string().nullable(),
  httpHeaders: z.array(KeyValuePairSchema),
  httpMethod: z.enum(HTTP_METHODS),
  httpUrl: requiredString().url({ message: "validation.urlInvalid" }),
});

export const DbQueryParamsFormSchema = z.object({
  fetchSize: z.coerce
    .number()
    .int({ message: "validation.positiveInt" })
    .positive({ message: "validation.positiveInt" }),
  jdbcPassword: z.string(),
  jdbcUrl: requiredString(),
  jdbcUser: z.string(),
  sql: requiredString(),
});

export const FileSftpParamsFormSchema = z.object({
  sftpFilePattern: z.string(),
  sftpHost: requiredString(),
  sftpMoveAfterDownload: z.boolean(),
  sftpPassword: z.string(),
  sftpPort: z.coerce
    .number()
    .int({ message: "validation.positiveInt" })
    .positive({ message: "validation.positiveInt" }),
  sftpProcessedDir: z.string(),
  sftpRemoteDir: z.string(),
  sftpUser: requiredString(),
});

const baseFields = {
  description: z.string().max(DESCRIPTION_MAX_LENGTH),
  enabled: z.boolean(),
  name: requiredString(NAME_MAX_LENGTH),
  natsSubject: requiredString(NATS_SUBJECT_MAX_LENGTH),
  secretIntent: z.enum(["keep", "change"]),
};

const cronExpression = z.string().max(CRON_MAX_LENGTH).nullable();

export const FlowFormSchema = z.discriminatedUnion("flowId", [
  z.object({
    ...baseFields,
    cronExpression: z.null(),
    flowId: z.literal("webhook_collector"),
    parameters: WebhookParamsFormSchema,
  }),
  z.object({
    ...baseFields,
    cronExpression,
    flowId: z.literal("http_rest_collector"),
    parameters: HttpRestParamsFormSchema,
  }),
  z.object({
    ...baseFields,
    cronExpression,
    flowId: z.literal("db_query_collector"),
    parameters: DbQueryParamsFormSchema,
  }),
  z.object({
    ...baseFields,
    cronExpression,
    flowId: z.literal("file_sftp_collector"),
    parameters: FileSftpParamsFormSchema,
  }),
]);

export type FlowFormValues = z.infer<typeof FlowFormSchema>;
export type HttpRestParamsFormValues = z.infer<typeof HttpRestParamsFormSchema>;
export type DbQueryParamsFormValues = z.infer<typeof DbQueryParamsFormSchema>;
export type FileSftpParamsFormValues = z.infer<typeof FileSftpParamsFormSchema>;
export type WebhookParamsFormValues = z.infer<typeof WebhookParamsFormSchema>;
