import {z} from "zod";

export const transactionSchemaParams = z.object({
    reference: z.string()
});

export type TrasactionParams = z.infer<typeof transactionSchemaParams>;

