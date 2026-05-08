export const pageRoutes = {
  authError: "/auth/error",
  collectorDetail: (collectorId: string) => `/collectors/${collectorId}`,
  collectorEdit: (collectorId: string) => `/collectors/${collectorId}/edit`,
  collectorNew: "/collectors/new",
  collectors: "/collectors",
  data: "/data",
  dlq: "/dlq",
  home: "/",
  messageDetail: (messageId: string) => `/data/messages/${messageId}`,
  profile: "/profile",
  subjectDetail: (subject: string) => `/data/${encodeURIComponent(subject)}`,
};

export const apiRoutes = {
  login: "/api/auth/login",
  logout: "/api/auth/logout",
};

export const beApiRoutes = {
  auth: {
    logout: "/api/auth/logout",
    refresh: "/api/auth/refresh",
  },
  collector: {
    base: "/api/collectors",
    detail: (collectorId: string) => `/api/collectors/${collectorId}`,
    runs: (collectorId: string) => `/api/collectors/${collectorId}/runs`,
  },
  data: {
    payloadDetail: (payloadId: string) => `/api/data/payloads/${payloadId}`,
    payloadRaw: (payloadId: string) => `/api/data/payloads/${payloadId}/raw`,
    payloads: "/api/data/payloads",
    stats: "/api/data/stats",
    subjects: "/api/data/subjects",
  },
  dlq: {
    base: "/api/dlq",
    detail: (dlqId: string) => `/api/dlq/${dlqId}`,
    retry: (dlqId: string) => `/api/dlq/${dlqId}/retry`,
  },
  user: {
    changePassword: "/api/users/me/password",
    me: "/api/users/me",
  },
  users: {
    me: "/api/users/me",
    permissions: "/api/users/me/permissions",
  },
};
