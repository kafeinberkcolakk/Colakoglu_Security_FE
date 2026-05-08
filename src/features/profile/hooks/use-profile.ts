import { useQuery } from "@tanstack/react-query";
import { profileApi } from "../api/profile-api";

export function useProfile() {
  return useQuery({
    queryFn: () => profileApi.getMe(),
    queryKey: ["user", "me"],
  });
}
