import {z} from "zod";

const passwordLength = z.string().min(8);

export const registerSchema = z.object({
    email: z.email(),
    password: passwordLength
});

export const loginSchema = z.object({
    email: z.email(),
    password: passwordLength
});

export const changePasswordSchema = z.object({
    currentPassword: passwordLength,
    newPassword: passwordLength
});

export const forgotPasswordSchema =z.object({
    email: z.email()
});

export const resetPasswordSchema = z.object({
    newPassword: passwordLength,
    token: z.string().min(1)
});

export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1)
});

export type ChangePasswordBody = z.infer<typeof changePasswordSchema>;

export type LoginBody = z.infer<typeof loginSchema>;

export type RegisterBody = z.infer<typeof registerSchema>;

export type ForgotPasswordBody = z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordBody = z.infer<typeof resetPasswordSchema>;

export type RefreshTokenBody = z.infer<typeof refreshTokenSchema>;