const VULNERABILITY_OK = "up_to_date";

export interface SentinelOneAgent {
  accountId?: string;
  accountName?: string;
  activeThreats?: number;
  agentVersion?: string;
  appsVulnerabilityStatus?: string;
  computerName?: string;
  domain?: string;
  externalIp?: string;
  firewallEnabled?: boolean;
  id?: string;
  infected?: boolean;
  isActive?: boolean;
  isUpToDate?: boolean;
  lastActiveDate?: string;
  modelName?: string;
  osName?: string;
  osType?: string;
}

export interface ThreatRollup {
  activeThreats: number;
  agents: SentinelOneAgent[];
  firewallOff: number;
  outdatedAgents: number;
  total: number;
  vulnerable: number;
}

interface PayloadShape {
  data?: SentinelOneAgent[];
}

function extractAgents(payload: unknown): SentinelOneAgent[] {
  if (
    payload === null ||
    payload === undefined ||
    typeof payload !== "object"
  ) {
    return [];
  }
  const data = (payload as PayloadShape).data;
  if (!Array.isArray(data)) {
    return [];
  }
  return data;
}

function latestVersion(agents: SentinelOneAgent[]): string | undefined {
  const versions = agents
    .map((a) => a.agentVersion)
    .filter((v): v is string => typeof v === "string" && v.length > 0)
    .sort();
  return versions.at(-1);
}

export function rollUpThreats(payload: unknown): ThreatRollup {
  const agents = extractAgents(payload);
  const latest = latestVersion(agents);

  let activeThreats = 0;
  let vulnerable = 0;
  let firewallOff = 0;
  let outdatedAgents = 0;

  for (const agent of agents) {
    if ((agent.activeThreats ?? 0) > 0) {
      activeThreats += 1;
    }
    if (
      agent.appsVulnerabilityStatus !== undefined &&
      agent.appsVulnerabilityStatus !== VULNERABILITY_OK
    ) {
      vulnerable += 1;
    }
    if (agent.firewallEnabled === false) {
      firewallOff += 1;
    }
    if (
      latest !== undefined &&
      agent.agentVersion !== undefined &&
      agent.agentVersion !== latest
    ) {
      outdatedAgents += 1;
    }
  }

  return {
    activeThreats,
    agents,
    firewallOff,
    outdatedAgents,
    total: agents.length,
    vulnerable,
  };
}

export function isAgentAtRisk(agent: SentinelOneAgent): boolean {
  if ((agent.activeThreats ?? 0) > 0) {
    return true;
  }
  if (agent.firewallEnabled === false) {
    return true;
  }
  if (
    agent.appsVulnerabilityStatus !== undefined &&
    agent.appsVulnerabilityStatus !== "up_to_date"
  ) {
    return true;
  }
  return false;
}
