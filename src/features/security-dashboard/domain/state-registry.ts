// The 6 QRadar collection states — see FE_DASHBOARD.md §1.
// `productName` is the filter key for /api/data/payloads and the /api/flows item name.
// `messageKey` is the camelCase i18n segment under page.securityDashboard.states.

import {
  Activity,
  Crosshair,
  type LucideIcon,
  Server,
  ShieldAlert,
  ShieldBan,
  UserX,
} from "lucide-react";

export type SecurityStateId =
  | "qradar-offenses"
  | "qradar-failed-logins"
  | "qradar-top-attackers"
  | "qradar-firewall-deny"
  | "qradar-log-sources"
  | "qradar-system-health";

export interface SecurityStateMeta {
  icon: LucideIcon;
  id: SecurityStateId;
  messageKey: string;
  // How many recent snapshots the trend card fetches (N+1 pattern, FE_DASHBOARD.md §3.3).
  trendSnapshots: number;
}

// 2 min poll → 12 snapshots ≈ 24 min; 5 min poll → 12 snapshots ≈ 1 h.
const DEFAULT_TREND_SNAPSHOTS = 12;
const OFFENSES_TREND_SNAPSHOTS = 24;

export const SECURITY_STATES: SecurityStateMeta[] = [
  {
    icon: ShieldAlert,
    id: "qradar-offenses",
    messageKey: "offenses",
    trendSnapshots: OFFENSES_TREND_SNAPSHOTS,
  },
  {
    icon: UserX,
    id: "qradar-failed-logins",
    messageKey: "failedLogins",
    trendSnapshots: DEFAULT_TREND_SNAPSHOTS,
  },
  {
    icon: Crosshair,
    id: "qradar-top-attackers",
    messageKey: "topAttackers",
    trendSnapshots: DEFAULT_TREND_SNAPSHOTS,
  },
  {
    icon: ShieldBan,
    id: "qradar-firewall-deny",
    messageKey: "firewallDeny",
    trendSnapshots: DEFAULT_TREND_SNAPSHOTS,
  },
  {
    icon: Server,
    id: "qradar-log-sources",
    messageKey: "logSources",
    trendSnapshots: DEFAULT_TREND_SNAPSHOTS,
  },
  {
    icon: Activity,
    id: "qradar-system-health",
    messageKey: "systemHealth",
    trendSnapshots: DEFAULT_TREND_SNAPSHOTS,
  },
];
