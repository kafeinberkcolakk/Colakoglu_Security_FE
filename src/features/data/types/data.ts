export interface DataStats {
  distinctSubjects: number;
  messagesLast24h: number;
  messagesLastHour: number;
  totalMessages: number;
}

export interface SubjectStats {
  firstReceivedAt: string;
  lastReceivedAt: string;
  messageCount: number;
  subject: string;
}

export interface PayloadSummary {
  id: string;
  isJson: boolean;
  messageId: string;
  payloadSize: number;
  receivedAt: string;
  subject: string;
}

export interface PayloadDetail {
  id: string;
  messageId: string;
  payload?: Record<string, unknown> | unknown[];
  rawPayloadBase64?: string;
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
  subjectPrefix?: string;
  to?: string;
}
