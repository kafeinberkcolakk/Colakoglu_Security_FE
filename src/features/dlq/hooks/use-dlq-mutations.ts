import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { dlqApi } from "@/features/dlq/api/dlq-api";

interface ErrorWithResponse {
  response?: { data?: unknown };
}

function buildErrorMessage(prefix: string, error: unknown): string {
  const candidate = error as ErrorWithResponse;
  const data = candidate?.response?.data;
  if (typeof data === "string" && data.length > 0) {
    return `${prefix} — ${data}`;
  }
  if (error instanceof Error) {
    return `${prefix} — ${error.message}`;
  }
  return prefix;
}

export function useRetryDlq(onSuccess?: () => void) {
  const t = useTranslations("page.dlq.toast");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dlqId: string) => dlqApi.retry(dlqId),
    onError: (error) => {
      toast.error(buildErrorMessage(t("retryError"), error));
    },
    onSuccess: () => {
      toast.success(t("retrySuccess"));
      queryClient.invalidateQueries({ queryKey: ["dlq", "list"] });
      onSuccess?.();
    },
  });
}

export function useDeleteDlq(onSuccess?: () => void) {
  const t = useTranslations("page.dlq.toast");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dlqId: string) => dlqApi.remove(dlqId),
    onError: (error) => {
      toast.error(buildErrorMessage(t("deleteError"), error));
    },
    onSuccess: () => {
      toast.success(t("deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: ["dlq", "list"] });
      onSuccess?.();
    },
  });
}
