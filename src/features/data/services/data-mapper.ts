import type {
  DataStats,
  PayloadDetail,
  PayloadPage,
  PayloadSummary,
  SubjectStats,
  WireDataStats,
  WirePayloadDetail,
  WirePayloadListResponse,
  WirePayloadSummary,
  WireSubjectStats,
} from "@/features/data/types/data";

export function fromWireStats(wire: WireDataStats): DataStats {
  return {
    distinctSubjects: wire.distinctSubjects,
    generatedAt: wire.generatedAt,
    messagesLast24h: wire.last24hPayloads,
    totalMessages: wire.totalPayloads,
  };
}

export function fromWireSubject(wire: WireSubjectStats): SubjectStats {
  return {
    lastReceivedAt: wire.lastReceived,
    messageCount: wire.count,
    subject: wire.subject,
  };
}

export function fromWirePayload(wire: WirePayloadSummary): PayloadSummary {
  return {
    hasJson: wire.hasJson,
    id: wire.id,
    jsonSize: wire.jsonSize,
    messageId: wire.messageId,
    payloadSize: wire.jsonSize + wire.rawSize,
    rawSize: wire.rawSize,
    receivedAt: wire.receivedAt,
    subject: wire.subject,
  };
}

export function fromWireList(wire: WirePayloadListResponse): PayloadPage {
  const limit = wire.limit > 0 ? wire.limit : 1;
  const page = Math.floor(wire.offset / limit);
  const totalPages = wire.total === 0 ? 0 : Math.ceil(wire.total / limit);
  return {
    content: wire.items.map(fromWirePayload),
    page,
    size: limit,
    totalElements: wire.total,
    totalPages,
  };
}

export function fromWireDetail(wire: WirePayloadDetail): PayloadDetail {
  return {
    hasRaw: wire.hasRaw,
    id: wire.id,
    messageId: wire.messageId,
    payload: wire.payload,
    rawSize: wire.rawSize,
    receivedAt: wire.receivedAt,
    subject: wire.subject,
  };
}
