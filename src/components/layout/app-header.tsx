"use client";

import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { apiRoutes, pageRoutes } from "@/lib/const/pages";

const AppHeader = () => {
  return (
    <header
      className="flex h-12 shrink-0 items-center justify-between px-4 gap-4"
      style={{ background: "linear-gradient(to right, #0f2447, #1a5276)" }}
    >
      <div className="flex items-center gap-2">
        <span className="text-white font-semibold text-sm tracking-wide">
          Kafein Partner
        </span>
        <span className="text-white/50 text-xs font-normal">0.0.1</span>
      </div>

      <div className="flex items-center gap-1.5">
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
