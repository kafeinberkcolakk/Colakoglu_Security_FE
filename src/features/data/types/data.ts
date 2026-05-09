// Internal UI model — page-based pagination, kept stable so DataTable / hooks don't break.
// Wire shape comes from REPORTING_API_FE.md and is mapped at the boundary (services/data-mapper.ts).

export interface DataStats {
  distinctSubjects: number;
  generatedAt: string;
  messagesLast24h: number;
  totalMessages: number;
}

export interface SubjectStats {
  lastReceivedAt: string;
  messageCount: number;
  subject: string;
}

export interface PayloadSummary {
  hasJson: boolean;
  id: string;
  jsonSize: number;
  messageId: string;
  payloadSize: number;
  rawSize: number;
  receivedAt: string;
  subject: string;
}

export interface PayloadDetail {
  hasRaw: boolean;
  id: string;
  messageId: string;
  payload?: Record<string, unknown> | unknown[];
  rawSize: number;
  receivedAt: string;
  subject: string;
}

export interface PayloadPage {
  content: PayloadSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface PayloadListQuery {
  from?: string;
  page?: number;
  size?: number;
  subject?: string;
}

// ---- Wire shapes (REPORTING_API_FE.md) ----

export interface WireDataStats {
  distinctSubjects: number;
  generatedAt: string;
  last24hPayloads: number;
  totalPayloads: number;
}

export interface WireSubjectStats {
  count: number;
  lastReceived: string;
  subject: string;
}

export interface WirePayloadSummary {
  hasJson: boolean;
  id: string;
  jsonSize: number;
  messageId: string;
  rawSize: number;
  receivedAt: string;
  subject: string;
}

export interface WirePayloadDetail {
  hasRaw: boolean;
  id: string;
  messageId: string;
  payload?: Record<string, unknown> | unknown[];
  rawSize: number;
  receivedAt: string;
  subject: string;
}

export interface WirePayloadListResponse {
  items: WirePayloadSummary[];
  limit: number;
  offset: number;
  total: number;
}
