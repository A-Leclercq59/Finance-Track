import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  DeleteBulkTransactionSchema,
  DeleteBulkTransactionSchemaType,
} from "@/schemas/transaction";

type RequestType = DeleteBulkTransactionSchemaType;

const useBulkDeleteTransactions = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: RequestType) => {
      const validation = DeleteBulkTransactionSchema.safeParse(data);
      if (!validation.success) {
        throw new Error("Invalid request data");
      }

      const response = await fetch("/api/transaction/bulk-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete transaction");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      toast.success("transactions deleted");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete transactions");
    },
  });

  return mutation;
};

export default useBulkDeleteTransactions;
