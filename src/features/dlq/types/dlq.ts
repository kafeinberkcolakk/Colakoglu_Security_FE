export const DLQ_CONSUMERS = ["raw-archiver", "pg-ingestion"] as const;

export type DlqConsumer = (typeof DLQ_CONSUMERS)[number];

export interface DlqEntry {
  consumer: string;
  errorMessage: string;
  id: string;
  occurredAt: string;
  originalSubject: string;
  payloadBytes: number;
  retriedAt: string | null;
  retryCount: number;
}
