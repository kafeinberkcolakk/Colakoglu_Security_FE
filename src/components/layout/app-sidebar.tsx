"use client";

import {
  Activity,
  BarChart3,
  Gauge,
  Inbox,
  LayoutDashboard,
  type LucideIcon,
  Menu,
  ShieldAlert,
  TrendingUp,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { pageRoutes } from "@/lib/const/pages";

type NavItem = {
  href: string;
  icon: LucideIcon;
  labelKey: string;
};

type NavGroup = {
  groupKey: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    groupKey: "monitoring",
    items: [
      { href: pageRoutes.home, icon: LayoutDashboard, labelKey: "dashboard" },
      { href: pageRoutes.data, icon: Activity, labelKey: "data" },
    ],
  },
  {
    groupKey: "reporting",
    items: [
      {
        href: pageRoutes.reportsSystem,
        icon: Gauge,
        labelKey: "reportsSystem",
      },
      {
        href: pageRoutes.reportsSubjects,
        icon: BarChart3,
        labelKey: "reportsSubjects",
      },
      {
        href: pageRoutes.reportsFlowPerformance,
        icon: TrendingUp,
        labelKey: "reportsFlowPerformance",
      },
      {
        href: pageRoutes.reportsThreats,
        icon: ShieldAlert,
        labelKey: "reportsThreats",
      },
    ],
  },
  {
    groupKey: "admin",
    items: [
      { href: pageRoutes.flows, icon: Workflow, labelKey: "flows" },
      { href: pageRoutes.dlq, icon: Inbox, labelKey: "dlq" },
    ],
  },
];

function SidebarHeaderContent() {
  const { state, toggleSidebar } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <div className="flex w-full items-center gap-2">
      <button
        className="flex size-8 shrink-0 items-center justify-center rounded text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        onClick={toggleSidebar}
        type="button"
      >
        <Menu className="size-5" />
      </button>
      {isExpanded && (
        <div className="flex size-7 shrink-0 items-center justify-center rounded border border-white/20 bg-white/10 text-sm font-bold text-white select-none">
          KP
        </div>
      )}
    </div>
  );
}

function isItemActive(pathname: string, href: string): boolean {
  if (href === pageRoutes.home) {
    return pathname === pageRoutes.home;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar() {
  const pathname = usePathname();
  const tMenu = useTranslations("sidebar.menu");
  const tGroup = useTranslations("sidebar.group");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader
        className="h-12 flex-row items-center gap-0 border-b-0 px-2 py-0"
        style={{ background: "#0d1b3e" }}
      >
        <SidebarHeaderContent />
      </SidebarHeader>

      <SidebarContent className="py-1">
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.groupKey}>
            <SidebarGroupLabel>{tGroup(group.groupKey)}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0 px-2">
                {group.items.map((item) => {
                  const label = tMenu(item.labelKey);
                  const active = isItemActive(pathname, item.href);

                  return (
                    <SidebarMenuItem key={item.labelKey}>
                      <SidebarMenuButton
                        asChild={true}
                        className="h-11 rounded-none text-sm font-normal text-foreground/80 hover:text-foreground"
                        isActive={active}
                        tooltip={label}
                      >
                        <Link href={item.href}>
                          <item.icon className="size-[18px] shrink-0" />
                          <span>{label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
