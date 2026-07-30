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

export type ChangePasswordBody = z.infer<typeof changePasswordSchema>;

export type LoginBody = z.infer<typeof loginSchema>;

export type RegisterBody = z.infer<typeof registerSchema>;