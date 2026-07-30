import {z} from "zod";

export const transactionParamsSchema = z.object({
    reference: z.string()
});

export const transactionQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(5),
    status: z.enum(['PENDING','FAILED','SUCCESS','SUSPENDED']).optional(),
    type: z.enum(['DEPOSIT','WITHDRAWAL','TRANSFER_IN','TRANSFER_OUT']).optional()
});

export type TrasactionParams = z.infer<typeof transactionParamsSchema>;

export type TransactionQuery = z.infer<typeof transactionQuerySchema>;