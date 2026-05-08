import { z } from "zod";

const NAME_MAX_LENGTH = 200;
const NATS_SUBJECT_MAX_LENGTH = 200;
const SECRET_MAX_LENGTH = 200;

const HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "HEAD",
  "OPTIONS",
] as const;

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

export const WebhookConfigFormSchema = z.object({});

export const HttpRestConfigFormSchema = z.object({
  body: z.string().nullable(),
  headers: z.array(KeyValuePairSchema),
  method: z.enum(HTTP_METHODS),
  url: requiredString().url({ message: "validation.urlInvalid" }),
});

export const DbQueryConfigFormSchema = z.object({
  fetchSize: z.coerce
    .number()
    .int({ message: "validation.positiveInt" })
    .positive({ message: "validation.positiveInt" }),
  jdbcUrl: requiredString(),
  password: requiredString(),
  sql: requiredString(),
  username: requiredString(),
});

export const FileSftpConfigFormSchema = z.object({
  filePattern: requiredString(),
  host: requiredString(),
  moveAfterDownload: z.boolean(),
  password: requiredString(),
  port: z.coerce
    .number()
    .int({ message: "validation.positiveInt" })
    .positive({ message: "validation.positiveInt" }),
  processedDir: z.string(),
  remoteDir: requiredString(),
  username: requiredString(),
});

const baseFields = {
  enabled: z.boolean(),
  name: requiredString(NAME_MAX_LENGTH),
  natsSubject: requiredString(NATS_SUBJECT_MAX_LENGTH),
  secret: z.string().max(SECRET_MAX_LENGTH),
  secretIntent: z.enum(["keep", "change"]),
};

const positiveIntervalSeconds = z.coerce
  .number()
  .int({ message: "validation.positiveInt" })
  .positive({ message: "validation.positiveInt" });

export const CollectorFormSchema = z.discriminatedUnion("type", [
  z.object({
    ...baseFields,
    config: WebhookConfigFormSchema,
    intervalSeconds: z.null(),
    type: z.literal("WEBHOOK"),
  }),
  z.object({
    ...baseFields,
    config: HttpRestConfigFormSchema,
    intervalSeconds: positiveIntervalSeconds,
    type: z.literal("HTTP_REST"),
  }),
  z.object({
    ...baseFields,
    config: DbQueryConfigFormSchema,
    intervalSeconds: positiveIntervalSeconds,
    type: z.literal("DB_QUERY"),
  }),
  z.object({
    ...baseFields,
    config: FileSftpConfigFormSchema,
    intervalSeconds: positiveIntervalSeconds,
    type: z.literal("FILE_SFTP"),
  }),
]);

export type CollectorFormValues = z.infer<typeof CollectorFormSchema>;
export type HttpRestConfigFormValues = z.infer<typeof HttpRestConfigFormSchema>;
export type DbQueryConfigFormValues = z.infer<typeof DbQueryConfigFormSchema>;
export type FileSftpConfigFormValues = z.infer<typeof FileSftpConfigFormSchema>;
