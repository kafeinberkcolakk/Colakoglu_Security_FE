"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { DataTable, type TableColumn } from "@/components/ui/data-table";
import {
  freshnessClass,
  subjectFreshness,
} from "@/features/data/domain/bucket-aggregation";
import type { SubjectStats } from "@/features/data/types/data";
import { pageRoutes } from "@/lib/const/pages";
import { formatDate, formatRelative } from "@/lib/format";

interface SubjectsTableProps {
  data: SubjectStats[];
}

export function SubjectsTable({ data }: SubjectsTableProps) {
  const t = useTranslations("page.data.subjects.table");
  const tRelative = useTranslations("relative");
  const tCore = useTranslations("core");

  const relativeLabels = {
    days: tRelative("days"),
    hours: tRelative("hours"),
    minutes: tRelative("minutes"),
    seconds: tRelative("seconds"),
  };

  const columns: TableColumn<SubjectStats>[] = [
    {
      header: t("subject"),
      key: "subject",
      render: (row) => (
        <Link
          className="font-medium text-primary hover:underline"
          href={pageRoutes.subjectDetail(row.subject)}
        >
          {row.subject}
        </Link>
      ),
      sortable: true,
    },
    {
      align: "right",
      header: t("messageCount"),
      key: "messageCount",
      sortable: true,
    },
    {
      header: t("firstReceivedAt"),
      key: "firstReceivedAt",
      render: (row) => formatDate(row.firstReceivedAt),
      sortable: true,
    },
    {
      header: t("lastReceivedAt"),
      key: "lastReceivedAt",
      render: (row) => {
        const freshness = subjectFreshness(row.lastReceivedAt);
        return (
          <span className={freshnessClass(freshness)}>
            {formatRelative(row.lastReceivedAt, relativeLabels)}
          </span>
        );
      },
      sortable: true,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      emptyMessage={tCore("noData")}
      getRowKey={(row) => row.subject}
    />
  );
}
