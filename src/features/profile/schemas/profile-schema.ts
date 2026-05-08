import { z } from "zod";

export const ProfileInfoSchema = z.object({
  email: z.string().email({ message: "validation.noValidEmail" }),
  firstName: z.string().min(1, { message: "validation.required" }),
  lastName: z.string().min(1, { message: "validation.required" }),
});

export const ChangePasswordSchema = z
  .object({
    confirmPassword: z.string().min(1, { message: "validation.required" }),
    currentPassword: z.string().min(1, { message: "validation.required" }),
    newPassword: z.string().min(1, { message: "validation.required" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "validation.passwordMismatch",
    path: ["confirmPassword"],
  });

export type ChangePasswordValues = z.infer<typeof ChangePasswordSchema>;
export type ProfileInfoValues = z.infer<typeof ProfileInfoSchema>;
