"use client";

import { useTranslations } from "next-intl";
import { type WidgetRegistry, WidgetState } from "@/components/widgets";
import { lastErrorMessage } from "@/features/flows/domain/run-aggregations";
import { useFlowRuns } from "@/features/flows/hooks/use-flow-runs";
import { useFlowsList } from "@/features/flows/hooks/use-flows-list";
import type { Flow } from "@/features/flows/types/flow";
import { truncate } from "@/lib/utils";

const FLOWS_LIMIT = 200;
const ERROR_TRUNCATE = 80;

function FlowsListWidget() {
  const t = useTranslations("page.flows.table");
  const tTypes = useTranslations("page.flows.types");
  const tWidgets = useTranslations("widgets.flowPerf");
  const flowsQuery = useFlowsList({ limit: FLOWS_LIMIT });
  const flows = flowsQuery.data?.items ?? [];

  return (
    <WidgetState
      emptyTitle={tWidgets("noFlows")}
      isEmpty={flows.length === 0}
      isLoading={flowsQuery.isLoading}
    >
      <div className="overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-card text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-3 py-2">{t("name")}</th>
              <th className="px-3 py-2">{t("type")}</th>
              <th className="px-3 py-2">{t("cronExpression")}</th>
              <th className="px-3 py-2 text-right">{t("enabled")}</th>
            </tr>
          </thead>
          <tbody>
            {flows.map((flow) => (
              <tr
                className="border-b border-border/40 hover:bg-muted/30"
                key={flow.id}
              >
                <td className="px-3 py-2 font-medium text-foreground">
                  {flow.name}
                </td>
                <td className="px-3 py-2 text-muted-foreground">
                  {tTypes(flow.flowId)}
                </td>
                <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                  {flow.cronExpression ?? "—"}
                </td>
                <td className="px-3 py-2 text-right">
                  {flow.enabled ? (
                    <span className="text-emerald-500">●</span>
                  ) : (
                    <span className="text-muted-foreground">○</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WidgetState>
  );
}

function TopErrorsRow({ flow }: { flow: Flow }) {
  const runsQuery = useFlowRuns({ flowId: flow.id, refetchInterval: false });
  const lastError = lastErrorMessage(runsQuery.data ?? []);
  if (!lastError) {
    return null;
  }
  return (
    <li className="flex flex-col gap-1 rounded border border-destructive/30 bg-destructive/5 px-3 py-2">
      <span className="text-xs font-medium text-foreground">{flow.name}</span>
      <span className="text-xs text-destructive">
        {truncate(lastError, ERROR_TRUNCATE)}
      </span>
    </li>
  );
}

function TopErrorsWidget() {
  const tWidgets = useTranslations("widgets.flowPerf");
  const flowsQuery = useFlowsList({ limit: FLOWS_LIMIT });
  const flows = flowsQuery.data?.items ?? [];

  return (
    <WidgetState
      emptyTitle={tWidgets("noFlows")}
      isEmpty={flows.length === 0}
      isLoading={flowsQuery.isLoading}
    >
      <ul className="flex flex-col gap-2">
        {flows.map((flow) => (
          <TopErrorsRow flow={flow} key={flow.id} />
        ))}
      </ul>
    </WidgetState>
  );
}

export const FLOW_PERFORMANCE_WIDGETS: WidgetRegistry = [
  {
    defaultLayout: { h: 8, minH: 4, minW: 6, w: 8, x: 0, y: 0 },
    id: "flowPerf.table",
    render: () => <FlowsListWidget />,
    titleKey: "flowPerf.table",
  },
  {
    defaultLayout: { h: 8, minH: 3, minW: 3, w: 4, x: 8, y: 0 },
    id: "flowPerf.topErrors",
    render: () => <TopErrorsWidget />,
    titleKey: "flowPerf.topErrors",
  },
];
