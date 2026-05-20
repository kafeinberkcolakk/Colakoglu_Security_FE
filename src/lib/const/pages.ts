export const pageRoutes = {
  authError: "/auth/error",
  data: "/data",
  dataProductDetail: (productName: string) =>
    `/data/products/${encodeURIComponent(productName)}`,
  dataProducts: "/data/products",
  flowDetail: (flowName: string) => `/flows/${encodeURIComponent(flowName)}`,
  flowgroAllProcessReport: "/flowgro-ui/all-process-report",
  flowgroCamundaUser: "/flowgro-ui/camunda-user",
  flowgroDeployment: "/flowgro-ui/deployment",
  flowgroFlowExecution: "/flowgro-ui/flow-execution",
  flowgroModeller: "/flowgro-ui/modeller",
  flowgroMyTasks: "/flowgro-ui/my-tasks",
  flowgroProcessCockpit: "/flowgro-ui/process-cockpit",
  flowgroUserReport: "/flowgro-ui/user-report",
  flows: "/flows",
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
  data: {
    payloadDetail: (payloadId: string) => `/api/data/payloads/${payloadId}`,
    payloadRaw: (payloadId: string) => `/api/data/payloads/${payloadId}/raw`,
    payloads: "/api/data/payloads",
    stats: "/api/data/stats",
    subjects: "/api/data/subjects",
  },
  flow: {
    list: "/api/flows",
  },
  health: "/actuator/health",
  integration: {
    collectorEvents: (productName: string) =>
      `/flowgro/integration/v1/collector-events/${productName}`,
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

export const SERVICE_PAYLOAD_SUBJECT = "service.payload";
