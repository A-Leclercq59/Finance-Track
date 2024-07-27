import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  EditCategorieSchema,
  EditCategorieSchemaType,
} from "@/schemas/categories";

type RequestType = EditCategorieSchemaType;

export const useEditCategorie = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: RequestType) => {
      const validation = EditCategorieSchema.safeParse(data);
      if (!validation.success) {
        throw new Error("Invalid request data");
      }

      const response = await fetch(`/api/categorie/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to edit categorie");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories", { id }] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Categorie updated");
    },
    onError: () => {
      toast.error("Failed to edit categorie");
    },
  });

  return mutation;
};

export default useEditCategorie;
