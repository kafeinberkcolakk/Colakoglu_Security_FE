"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "../hooks/use-profile";
import {
  useChangePassword,
  useUpdateProfile,
} from "../hooks/use-profile-mutations";
import {
  ChangePasswordSchema,
  type ChangePasswordValues,
  ProfileInfoSchema,
  type ProfileInfoValues,
} from "../schemas/profile-schema";

const SKELETON_COUNT = 4;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold text-foreground">{children}</h2>
  );
}

export function ProfileScreen() {
  const t = useTranslations();
  const { data: profile, isLoading } = useProfile();

  const infoForm = useForm<ProfileInfoValues>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
    },
    resolver: zodResolver(ProfileInfoSchema),
  });

  const passwordForm = useForm<ChangePasswordValues>({
    defaultValues: {
      confirmPassword: "",
      currentPassword: "",
      newPassword: "",
    },
    resolver: zodResolver(ChangePasswordSchema),
  });

  useEffect(() => {
    if (profile) {
      infoForm.reset({
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
      });
    }
  }, [profile, infoForm]);

  const updateMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword(() => passwordForm.reset());

  return (
    <div>
      <PageHeader title={t("page.profile.title")} />

      <div className="px-6 pb-6">
        {isLoading ? (
          <div className="flex max-w-lg flex-col gap-4 pt-4">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders have no stable id
              <div className="flex flex-col gap-2" key={i}>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
            <Skeleton className="mt-2 h-9 w-24" />
          </div>
        ) : (
          <>
            <form
              className="mt-4 flex max-w-lg flex-col gap-4"
              id="profile-info-form"
              onSubmit={infoForm.handleSubmit((data) =>
                updateMutation.mutate(data),
              )}
            >
              <SectionTitle>{t("page.profile.sections.info")}</SectionTitle>

              <div className="grid grid-cols-2 gap-4">
                <Controller
                  control={infoForm.control}
                  name="firstName"
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="profile-firstName">
                        {t("page.profile.form.firstName")}
                      </Label>
                      <Input id="profile-firstName" {...field} />
                      {fieldState.error && (
                        <p className="text-xs text-destructive">
                          {t(fieldState.error.message ?? "validation.required")}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  control={infoForm.control}
                  name="lastName"
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="profile-lastName">
                        {t("page.profile.form.lastName")}
                      </Label>
                      <Input id="profile-lastName" {...field} />
                      {fieldState.error && (
                        <p className="text-xs text-destructive">
                          {t(fieldState.error.message ?? "validation.required")}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Controller
                  control={infoForm.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="profile-email">
                        {t("page.profile.form.email")}
                      </Label>
                      <Input id="profile-email" type="email" {...field} />
                      {fieldState.error && (
                        <p className="text-xs text-destructive">
                          {t(
                            fieldState.error.message ??
                              "validation.noValidEmail",
                          )}
                        </p>
                      )}
                    </div>
                  )}
                />

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="profile-userName">
                    {t("page.profile.form.userName")}
                  </Label>
                  <Input
                    disabled={true}
                    id="profile-userName"
                    readOnly={true}
                    value={profile?.userName ?? ""}
                  />
                </div>
              </div>

              <Button
                className="w-fit"
                disabled={updateMutation.isPending}
                type="submit"
              >
                {t("core.save")}
              </Button>
            </form>

            <form
              className="mt-8 flex max-w-lg flex-col gap-4"
              id="profile-password-form"
              onSubmit={passwordForm.handleSubmit((data) =>
                changePasswordMutation.mutate(data),
              )}
            >
              <SectionTitle>{t("page.profile.sections.password")}</SectionTitle>

              <Controller
                control={passwordForm.control}
                name="currentPassword"
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="profile-currentPassword">
                      {t("page.profile.form.currentPassword")}
                    </Label>
                    <Input
                      id="profile-currentPassword"
                      type="password"
                      {...field}
                    />
                    {fieldState.error && (
                      <p className="text-xs text-destructive">
                        {t(fieldState.error.message ?? "validation.required")}
                      </p>
                    )}
                  </div>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <Controller
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="profile-newPassword">
                        {t("page.profile.form.newPassword")}
                      </Label>
                      <Input
                        id="profile-newPassword"
                        type="password"
                        {...field}
                      />
                      {fieldState.error && (
                        <p className="text-xs text-destructive">
                          {t(fieldState.error.message ?? "validation.required")}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="profile-confirmPassword">
                        {t("page.profile.form.confirmPassword")}
                      </Label>
                      <Input
                        id="profile-confirmPassword"
                        type="password"
                        {...field}
                      />
                      {fieldState.error && (
                        <p className="text-xs text-destructive">
                          {t(fieldState.error.message ?? "validation.required")}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <Button
                className="w-fit"
                disabled={changePasswordMutation.isPending}
                type="submit"
              >
                {t("core.update")}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
