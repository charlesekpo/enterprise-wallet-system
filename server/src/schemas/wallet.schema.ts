import { z } from "zod";

export const depositSchema = z.object({
    amount: z.number().positive()
});

export type DepositBody = z.infer<typeof depositSchema>;