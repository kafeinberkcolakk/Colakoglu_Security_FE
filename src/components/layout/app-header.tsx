"use client";

import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { HealthDot } from "@/components/layout/health-dot";
import { LanguagePicker } from "@/components/layout/language-picker";
import { apiRoutes, pageRoutes } from "@/lib/const/pages";

const AppHeader = () => {
  return (
    <header className="z-10 flex h-12 shrink-0 items-center justify-between gap-4 bg-linear-to-r from-brand-from to-brand-to px-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-white font-semibold text-sm tracking-wide">
          Colakoglu Security
        </span>
        <span className="text-white/50 text-xs font-normal">0.0.1</span>
        <HealthDot />
      </div>

      <div className="flex items-center gap-1.5">
        <LanguagePicker />

        <Link
          className="flex size-8 items-center justify-center rounded text-white hover:bg-white/10 transition-colors"
          href={pageRoutes.profile}
        >
          <User className="size-4" />
        </Link>

        <a
          className="flex size-8 items-center justify-center rounded text-white hover:bg-white/10 transition-colors"
          href={apiRoutes.logout}
        >
          <LogOut className="size-4" />
        </a>
      </div>
    </header>
  );
};

export default AppHeader;
