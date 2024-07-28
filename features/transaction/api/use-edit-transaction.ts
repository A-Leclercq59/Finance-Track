import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  EditTransactionSchema,
  EditTransactionSchemaType,
} from "@/schemas/transaction";

type RequestType = EditTransactionSchemaType;

export const useEditTransaction = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: RequestType) => {
      const validation = EditTransactionSchema.safeParse(data);
      if (!validation.success) {
        throw new Error("Invalid request data");
      }

      const response = await fetch(`/api/transaction/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to edit transaction");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactions", { id }] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      toast.success("Transaction updated");
    },
    onError: () => {
      toast.error("Failed to edit transaction");
    },
  });

  return mutation;
};

export default useEditTransaction;
