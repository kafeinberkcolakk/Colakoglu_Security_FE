import { beApiRoutes } from "@/lib/const/pages";
import { fetcher } from "@/lib/fetch/fe";
import type { UserProfile } from "../types/profile";

interface ApiResponse<T> {
  code: number;
  data: T;
  isSuccess: boolean;
  message: string;
}

interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
}

interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

interface UserProfileApiResponse {
  culture: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  username: string;
}

type UpdateProfilePayload = Pick<
  UserProfile,
  "email" | "firstName" | "lastName"
>;

function normalizeProfile(profile: UserProfileApiResponse): UserProfile {
  return {
    culture: profile.culture,
    email: profile.email,
    emailVerified: profile.emailVerified,
    firstName: profile.firstName,
    lastName: profile.lastName,
    userName: profile.username,
  };
}

function toChangePasswordPayload(
  data: ChangePasswordFormValues,
): ChangePasswordPayload {
  return {
    newPassword: data.newPassword,
    oldPassword: data.currentPassword,
  };
}

export const profileApi = {
  changePassword: async (data: ChangePasswordFormValues): Promise<void> => {
    await fetcher.put(
      beApiRoutes.user.changePassword,
      toChangePasswordPayload(data),
    );
  },

  getMe: async (): Promise<UserProfile> => {
    const response = await fetcher.get<ApiResponse<UserProfileApiResponse>>(
      beApiRoutes.user.me,
    );
    return normalizeProfile(response.data.data);
  },

  updateMe: async (
    data: UpdateProfilePayload,
  ): Promise<UserProfile | undefined> => {
    const response = await fetcher.put<
      ApiResponse<UserProfileApiResponse | null>
    >(beApiRoutes.user.me, data);
    return response.data.data
      ? normalizeProfile(response.data.data)
      : undefined;
  },
};
