import { z } from "zod";

export const depositSchema = z.object({
    amount: z.number().positive()
});

export const withdrawSchema = z.object({
    amount: z.number().positive()
});

export const transferSchema = z.object({
    email: z.email(),
    amount: z.number().positive()
});

export type DepositBody = z.infer<typeof depositSchema>;

export type WithdrawBody = z.infer<typeof withdrawSchema>;

export type TransferBody = z.infer<typeof transferSchema>;