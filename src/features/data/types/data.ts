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
  payload?: Record<string, unknown> | unknown[];
  payloadSize: number;
  productName?: string;
  rawSize: number;
  receivedAt: string;
  subject: string;
}

export interface PayloadDetail {
  hasRaw: boolean;
  id: string;
  messageId: string;
  payload?: Record<string, unknown> | unknown[] | string;
  productName?: string;
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
  productName?: string;
  size?: number;
  subject?: string;
}

// Logical-source-aggregated view (derived client-side from service.payload stream).
export interface ProductStats {
  lastReceivedAt: string;
  messageCount: number;
  productName: string;
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
  payload?: Record<string, unknown> | unknown[];
  productName?: string | null;
  rawSize: number;
  receivedAt: string;
  subject: string;
}

// New BE detail returns `payload` that may be either:
//   - JSON object (BPMN envelope: { productName, response: { ..., body: string } })
//   - raw string when parse failed
export interface WirePayloadDetail {
  hasRaw: boolean;
  id: string;
  messageId: string;
  payload?: Record<string, unknown> | unknown[] | string;
  productName?: string | null;
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
