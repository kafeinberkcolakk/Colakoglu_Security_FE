"use client";

import {
  Activity,
  Inbox,
  LayoutDashboard,
  type LucideIcon,
  Menu,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Sidebar,
  SidebarContent,
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

const NAV_ITEMS: NavItem[] = [
  { href: pageRoutes.home, icon: LayoutDashboard, labelKey: "dashboard" },
  { href: pageRoutes.data, icon: Activity, labelKey: "data" },
  { href: pageRoutes.collectors, icon: Workflow, labelKey: "collectors" },
  { href: pageRoutes.dlq, icon: Inbox, labelKey: "dlq" },
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

export function AppSidebar() {
  const pathname = usePathname();
  const t = useTranslations("sidebar.menu");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader
        className="h-12 flex-row items-center gap-0 border-b-0 px-2 py-0"
        style={{ background: "#0d1b3e" }}
      >
        <SidebarHeaderContent />
      </SidebarHeader>

      <SidebarContent className="py-1">
        <SidebarMenu className="gap-0 px-2">
          {NAV_ITEMS.map((item) => {
            const label = t(item.labelKey);
            const isActive =
              item.href === pageRoutes.home
                ? pathname === pageRoutes.home
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <SidebarMenuItem key={item.labelKey}>
                <SidebarMenuButton
                  asChild={true}
                  className="h-11 rounded-none text-sm font-normal text-foreground/80 hover:text-foreground"
                  isActive={isActive}
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
      </SidebarContent>
    </Sidebar>
  );
}
