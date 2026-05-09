export const pageRoutes = {
  authError: "/auth/error",
  data: "/data",
  dlq: "/dlq",
  flowDetail: (flowId: number | string) => `/flows/${flowId}`,
  flowEdit: (flowId: number | string) => `/flows/${flowId}/edit`,
  flowNew: "/flows/new",
  flows: "/flows",
  home: "/",
  messageDetail: (messageId: string) => `/data/messages/${messageId}`,
  profile: "/profile",
  reportsFlowPerformance: "/reports/flow-performance",
  reportsSubjects: "/reports/subjects",
  reportsSystem: "/reports/system",
  reportsThreats: "/reports/threats",
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
  flow: {
    list: "/api/flows",
    runs: (flowId: number) =>
      `/flowgro/v1/flow-execution-scheduler/${flowId}/runs`,
    schedulerById: (flowId: number) =>
      `/flowgro/v1/flow-execution-scheduler/${flowId}`,
    schedulerEnabled: (flowId: number) =>
      `/flowgro/v1/flow-execution-scheduler/${flowId}/enabled`,
    schedulerRoot: "/flowgro/v1/flow-execution-scheduler",
    schedulerRun: (flowId: number) =>
      `/flowgro/v1/flow-execution-scheduler/run/${flowId}`,
  },
  health: "/actuator/health",
  user: {
    changePassword: "/api/users/me/password",
    me: "/api/users/me",
  },
  users: {
    me: "/api/users/me",
    permissions: "/api/users/me/permissions",
  },
};
