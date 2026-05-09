import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { flowsApi } from "@/features/flows/api/flows-api";
import type {
  CreateFlowRequest,
  UpdateFlowRequest,
} from "@/features/flows/services/flow-mapper";

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

export function useCreateFlow(onSuccess?: (id: number) => void) {
  const t = useTranslations("page.flows.toast");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFlowRequest) => flowsApi.create(payload),
    onError: (error) => {
      toast.error(buildErrorMessage(t("createError"), error));
    },
    onSuccess: ({ id }) => {
      toast.success(t("createSuccess"));
      queryClient.invalidateQueries({ queryKey: ["flows", "list"] });
      onSuccess?.(id);
    },
  });
}

export function useUpdateFlow(flowId: number, onSuccess?: () => void) {
  const t = useTranslations("page.flows.toast");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateFlowRequest) => flowsApi.update(payload),
    onError: (error) => {
      toast.error(buildErrorMessage(t("updateError"), error));
    },
    onSuccess: () => {
      toast.success(t("updateSuccess"));
      queryClient.invalidateQueries({ queryKey: ["flows", "list"] });
      queryClient.invalidateQueries({
        queryKey: ["flows", "detail", flowId],
      });
      onSuccess?.();
    },
  });
}

export function useDeleteFlow(onSuccess?: () => void) {
  const t = useTranslations("page.flows.toast");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => flowsApi.remove(id),
    onError: (error) => {
      toast.error(buildErrorMessage(t("deleteError"), error));
    },
    onSuccess: () => {
      toast.success(t("deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: ["flows"] });
      onSuccess?.();
    },
  });
}

export function useToggleFlowEnabled(flowId: number) {
  const t = useTranslations("page.flows.toast");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enabled: boolean) => flowsApi.setEnabled(flowId, enabled),
    onError: (error) => {
      toast.error(buildErrorMessage(t("updateError"), error));
    },
    onSuccess: () => {
      toast.success(t("updateSuccess"));
      queryClient.invalidateQueries({ queryKey: ["flows"] });
    },
  });
}

export function useRunFlow(flowId: number) {
  const t = useTranslations("page.flows.toast");

  return useMutation({
    mutationFn: () => flowsApi.run(flowId),
    onError: (error) => {
      toast.error(buildErrorMessage(t("runError"), error));
    },
    onSuccess: () => {
      toast.success(t("runSuccess"));
    },
  });
}
