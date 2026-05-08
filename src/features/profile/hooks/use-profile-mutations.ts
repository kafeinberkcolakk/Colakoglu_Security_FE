import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { profileApi } from "../api/profile-api";
import type {
  ChangePasswordValues,
  ProfileInfoValues,
} from "../schemas/profile-schema";

export function useUpdateProfile(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  const t = useTranslations("page.profile.toast");
  return useMutation({
    mutationFn: (data: ProfileInfoValues) => profileApi.updateMe(data),
    onError: () => {
      toast.error(t("updateError"));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      toast.success(t("updateSuccess"));
      onSuccess?.();
    },
  });
}

export function useChangePassword(onSuccess?: () => void) {
  const t = useTranslations("page.profile.toast");
  return useMutation({
    mutationFn: (data: ChangePasswordValues) => profileApi.changePassword(data),
    onError: () => {
      toast.error(t("passwordError"));
    },
    onSuccess: () => {
      toast.success(t("passwordSuccess"));
      onSuccess?.();
    },
  });
}
