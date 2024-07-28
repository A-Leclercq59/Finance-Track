import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  CreateCategoriesSchema,
  CreateCategoriesSchemaType,
} from "@/schemas/categories";

type RequestType = CreateCategoriesSchemaType;

export const useCreateCategorie = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: RequestType) => {
      const validation = CreateCategoriesSchema.safeParse(data);
      if (!validation.success) {
        throw new Error("Invalid request data");
      }

      const response = await fetch("/api/categorie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create categorie");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      toast.success("Categorie created");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create Categorie");
    },
  });

  return mutation;
};

export default useCreateCategorie;
