import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  DeleteBulkCategoriesSchema,
  DeleteBulkCategoriesSchemaType,
} from "@/schemas/categories";

type RequestType = DeleteBulkCategoriesSchemaType;

export const useDeleteBulkCategorie = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: RequestType) => {
      const validation = DeleteBulkCategoriesSchema.safeParse(data);
      if (!validation.success) {
        throw new Error("Invalid request data");
      }

      const response = await fetch("/api/categorie/bulk-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create account");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("categories deleted");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete categories");
    },
  });

  return mutation;
};

export default useDeleteBulkCategorie;
