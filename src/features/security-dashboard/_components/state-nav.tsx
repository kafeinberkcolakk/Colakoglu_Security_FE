"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { SECURITY_STATES } from "@/features/security-dashboard/domain/state-registry";
import { cn } from "@/lib/utils";

const OBSERVER_OPTIONS: IntersectionObserverInit = {
  rootMargin: "-30% 0px -60% 0px",
};

export function StateNav() {
  const t = useTranslations("page.securityDashboard.states");
  const [activeId, setActiveId] = useState<string>(SECURITY_STATES[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      }
    }, OBSERVER_OPTIONS);

    for (const state of SECURITY_STATES) {
      const element = document.getElementById(state.id);
      if (element !== null) {
        observer.observe(element);
      }
    }
    return () => observer.disconnect();
  }, []);

  const handleJump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-20 -mx-6 mb-4 flex gap-1 overflow-x-auto border-b bg-background/95 px-6 py-2 backdrop-blur">
      {SECURITY_STATES.map((state) => (
        <button
          className={cn(
            "whitespace-nowrap rounded px-3 py-1.5 text-sm transition-colors",
            activeId === state.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted",
          )}
          key={state.id}
          onClick={() => handleJump(state.id)}
          type="button"
        >
          {t(`${state.messageKey}.title`)}
        </button>
      ))}
    </nav>
  );
}
