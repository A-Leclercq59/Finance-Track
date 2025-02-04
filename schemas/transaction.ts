import { isValid, parseISO } from "date-fns";
import { z } from "zod";

export const CreateTransactionSchema = z.object({
  amount: z.number(),
  payee: z.string(),
  notes: z.string().optional(),
  date: z.coerce.date(),
  accountBankId: z.string(),
  categorieId: z.string().optional(),
});

export type CreateTransactionSchemaType = z.infer<
  typeof CreateTransactionSchema
>;

export const DeleteBulkTransactionSchema = z.object({
  ids: z.array(z.string()),
});

export type DeleteBulkTransactionSchemaType = z.infer<
  typeof DeleteBulkTransactionSchema
>;

export const EditTransactionSchema = z.object({
  amount: z.number(),
  payee: z.string(),
  notes: z.string().optional(),
  date: z.coerce.date(),
  accountBankId: z.string(),
  categorieId: z.string().optional(),
});

export type EditTransactionSchemaType = z.infer<typeof EditTransactionSchema>;

export const GetTransactionQuerySchema = z.object({
  from: z
    .string()
    .optional()
    .refine((dateStr) => !dateStr || isValid(parseISO(dateStr)), {
      message: "Invalid date format",
    }),
  to: z
    .string()
    .optional()
    .refine((dateStr) => !dateStr || isValid(parseISO(dateStr)), {
      message: "Invalid date format",
    }),
  accountId: z.string().optional(),
});

export type GetTransactionQuerySchemaType = z.infer<
  typeof GetTransactionQuerySchema
>;

export const BulkCreateTransactionSchema = z.array(CreateTransactionSchema);

export type BulkCreateTransactionSchemaType = z.infer<
  typeof BulkCreateTransactionSchema
>;

export const CreateWireTransferSchema = z.object({
  amount: z.number(),
  payee: z.string(),
  notes: z.string().optional(),
  date: z.coerce.date(),
  accountBankSourceId: z.string(),
  accountBankTargetId: z.string(),
  categorieId: z.string().optional(),
});

export type CreateWireTransferSchemaType = z.infer<
  typeof CreateWireTransferSchema
>;
