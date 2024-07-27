import { z } from "zod";

export const CreateCategoriesSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type CreateCategoriesSchemaType = z.infer<typeof CreateCategoriesSchema>;

export const DeleteBulkCategoriesSchema = z.object({
  ids: z.array(z.string()),
});

export type DeleteBulkCategoriesSchemaType = z.infer<
  typeof DeleteBulkCategoriesSchema
>;

export const EditCategorieSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type EditCategorieSchemaType = z.infer<typeof EditCategorieSchema>;
