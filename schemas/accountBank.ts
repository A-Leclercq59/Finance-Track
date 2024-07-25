import { z } from "zod";

export const CreateAccountBankSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type CreateAccountSchemaType = z.infer<typeof CreateAccountBankSchema>;

export const DeleteBulkAccountBankSchema = z.object({
  ids: z.array(z.string()),
});

export type DeleteBulkAccountBankSchemaType = z.infer<
  typeof DeleteBulkAccountBankSchema
>;

export const EditAccountBankSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type EditAccountBankSchemaType = z.infer<typeof EditAccountBankSchema>;
