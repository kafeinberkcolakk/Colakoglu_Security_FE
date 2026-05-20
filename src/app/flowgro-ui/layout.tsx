import type { ReactNode } from "react";

interface FlowgroUiLayoutProps {
  children: ReactNode;
}

export default function FlowgroUiLayout({ children }: FlowgroUiLayoutProps) {
  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col">{children}</div>
  );
}
