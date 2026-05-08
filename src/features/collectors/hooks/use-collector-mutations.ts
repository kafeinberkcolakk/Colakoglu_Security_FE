import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { collectorsApi } from "@/features/collectors/api/collectors-api";
import type {
  CollectorCreateRequest,
  CollectorUpdateRequest,
} from "@/features/collectors/services/collector-mapper";
import type { Collector } from "@/features/collectors/types/collector";

interface ErrorWithResponse {
  response?: { data?: unknown };
}

function extractMessage(error: unknown): string {
  const candidate = error as ErrorWithResponse;
  const data = candidate?.response?.data;
  if (typeof data === "string" && data.length > 0) {
    return data;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "";
}

function buildErrorMessage(prefix: string, error: unknown): string {
  const detail = extractMessage(error);
  return detail === "" ? prefix : `${prefix} — ${detail}`;
}

export function useCreateCollector(onSuccess?: (collector: Collector) => void) {
  const t = useTranslations("page.collectors.toast");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CollectorCreateRequest) =>
      collectorsApi.create(payload),
    onError: (error) => {
      toast.error(buildErrorMessage(t("createError"), error));
    },
    onSuccess: (collector) => {
      toast.success(t("createSuccess"));
      queryClient.invalidateQueries({ queryKey: ["collectors", "list"] });
      onSuccess?.(collector);
    },
  });
}

export function useUpdateCollector(
  collectorId: string,
  onSuccess?: (collector: Collector) => void,
) {
  const t = useTranslations("page.collectors.toast");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CollectorUpdateRequest) =>
      collectorsApi.update(collectorId, payload),
    onError: (error) => {
      toast.error(buildErrorMessage(t("updateError"), error));
    },
    onSuccess: (collector) => {
      toast.success(t("updateSuccess"));
      queryClient.invalidateQueries({ queryKey: ["collectors", "list"] });
      queryClient.invalidateQueries({
        queryKey: ["collectors", "detail", collectorId],
      });
      onSuccess?.(collector);
    },
  });
}

export function useDeleteCollector(onSuccess?: () => void) {
  const t = useTranslations("page.collectors.toast");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collectorId: string) => collectorsApi.remove(collectorId),
    onError: (error) => {
      toast.error(buildErrorMessage(t("deleteError"), error));
    },
    onSuccess: () => {
      toast.success(t("deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: ["collectors"] });
      onSuccess?.();
    },
  });
}
