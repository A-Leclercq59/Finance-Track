import { z } from "zod";

export const CreateAccountBankSchema = z.object({
  name: z.string().min(1, "Name is required"),
  userId: z.string().min(1, "UserId is required"),
});

export type CreateAccountSchemaType = z.infer<typeof CreateAccountBankSchema>;

export const DeleteBulkAccountBankSchema = z.object({
  ids: z.array(z.string()),
});

export type DeleteBulkAccountBankSchemaType = z.infer<
  typeof DeleteBulkAccountBankSchema
>;
