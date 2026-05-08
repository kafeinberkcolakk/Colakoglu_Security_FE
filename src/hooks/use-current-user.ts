import { useQuery } from "@tanstack/react-query";
import { beApiRoutes } from "@/lib/const/pages";
import { fetcher } from "@/lib/fetch/fe";
import type { ApiResponse } from "@/lib/types";

export interface CurrentUser {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  roles: string[];
  userName: string;
}

const STALE_MINUTES = 5;
const SECONDS_PER_MINUTE = 60;
const MS_PER_SECOND = 1000;
const STALE_TIME_MS = STALE_MINUTES * SECONDS_PER_MINUTE * MS_PER_SECOND;

async function fetchCurrentUser(): Promise<CurrentUser> {
  const response = await fetcher.get<ApiResponse<CurrentUser>>(
    beApiRoutes.users.me,
  );
  return response.data.data;
}

export function useCurrentUser() {
  return useQuery({
    queryFn: fetchCurrentUser,
    queryKey: ["current-user"],
    staleTime: STALE_TIME_MS,
  });
}
