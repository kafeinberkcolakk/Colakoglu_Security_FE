"use client";

import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface KeyValuePair {
  key: string;
  value: string;
}

interface KvListInputProps {
  keyPlaceholder?: string;
  onChange: (next: KeyValuePair[]) => void;
  value: KeyValuePair[];
  valuePlaceholder?: string;
}

export function KvListInput({
  keyPlaceholder,
  onChange,
  value,
  valuePlaceholder,
}: KvListInputProps) {
  const t = useTranslations();

  const updateAt = (index: number, patch: Partial<KeyValuePair>) => {
    const next = value.map((item, idx) =>
      idx === index ? { ...item, ...patch } : item,
    );
    onChange(next);
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, idx) => idx !== index));
  };

  const addRow = () => {
    onChange([...value, { key: "", value: "" }]);
  };

  return (
    <div className="flex flex-col gap-2">
      {value.map((row, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: kv pairs reorder rarely; index is sufficient
        <div className="flex gap-2" key={`kv-${index}`}>
          <Input
            className="flex-1"
            onChange={(event) => updateAt(index, { key: event.target.value })}
            placeholder={keyPlaceholder ?? t("core.enter")}
            value={row.key}
          />
          <Input
            className="flex-1"
            onChange={(event) => updateAt(index, { value: event.target.value })}
            placeholder={valuePlaceholder ?? t("core.enter")}
            value={row.value}
          />
          <Button
            aria-label={t("core.clear")}
            onClick={() => removeAt(index)}
            size="icon-sm"
            type="button"
            variant="outline"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        className="w-fit"
        onClick={addRow}
        size="sm"
        type="button"
        variant="outline"
      >
        {t("core.new")}
      </Button>
    </div>
  );
}
