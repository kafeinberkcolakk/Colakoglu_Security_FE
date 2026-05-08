"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface JsonTreeViewProps {
  data: unknown;
  className?: string;
  initiallyOpen?: boolean;
}

export function JsonTreeView({
  data,
  className,
  initiallyOpen = true,
}: JsonTreeViewProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-card p-3 font-mono text-xs",
        className,
      )}
    >
      <JsonNode initiallyOpen={initiallyOpen} name="root" value={data} />
    </div>
  );
}

interface JsonNodeProps {
  initiallyOpen: boolean;
  name: string;
  value: unknown;
}

function JsonNode({ initiallyOpen, name, value }: JsonNodeProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  if (Array.isArray(value)) {
    return (
      <CollapsibleNode
        isOpen={isOpen}
        onToggle={() => setIsOpen((prev) => !prev)}
        summary={`Array(${value.length})`}
        title={name}
      >
        {value.map((item, index) => (
          <JsonNode
            initiallyOpen={false}
            // biome-ignore lint/suspicious/noArrayIndexKey: array indices are stable identifiers in JSON tree
            key={`${name}-${index}`}
            name={`[${index}]`}
            value={item}
          />
        ))}
      </CollapsibleNode>
    );
  }

  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    return (
      <CollapsibleNode
        isOpen={isOpen}
        onToggle={() => setIsOpen((prev) => !prev)}
        summary={`Object(${entries.length})`}
        title={name}
      >
        {entries.map(([key, child]) => (
          <JsonNode initiallyOpen={false} key={key} name={key} value={child} />
        ))}
      </CollapsibleNode>
    );
  }

  return <LeafNode name={name} value={value} />;
}

interface CollapsibleNodeProps {
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  summary: string;
  title: string;
}

function CollapsibleNode({
  children,
  isOpen,
  onToggle,
  summary,
  title,
}: CollapsibleNodeProps) {
  return (
    <div className="my-0.5">
      <button
        className="flex items-center gap-1 text-foreground hover:text-primary"
        onClick={onToggle}
        type="button"
      >
        {isOpen ? (
          <ChevronDown className="size-3.5" />
        ) : (
          <ChevronRight className="size-3.5" />
        )}
        <span className="font-semibold">{title}</span>
        <span className="text-muted-foreground">{summary}</span>
      </button>
      {isOpen && (
        <div className="ml-4 border-l border-border pl-3">{children}</div>
      )}
    </div>
  );
}

function LeafNode({ name, value }: { name: string; value: unknown }) {
  const renderValue = () => {
    if (value === null) {
      return <span className="text-muted-foreground">null</span>;
    }
    if (typeof value === "string") {
      return (
        <span className="text-emerald-600">
          {`"${value}"`}
        </span>
      );
    }
    if (typeof value === "number") {
      return <span className="text-sky-600">{value}</span>;
    }
    if (typeof value === "boolean") {
      return <span className="text-amber-600">{String(value)}</span>;
    }
    return <span>{String(value)}</span>;
  };

  return (
    <div className="my-0.5 flex gap-2">
      <span className="font-semibold text-foreground">{name}:</span>
      {renderValue()}
    </div>
  );
}
