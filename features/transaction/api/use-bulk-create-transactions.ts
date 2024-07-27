import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  BulkCreateTransactionSchema,
  BulkCreateTransactionSchemaType,
} from "@/schemas/transaction";

type RequestType = BulkCreateTransactionSchemaType;

const useBulkCreateTransactions = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: RequestType) => {
      const validation = BulkCreateTransactionSchema.safeParse(data);
      if (!validation.success) {
        throw new Error("Invalid request data");
      }

      const response = await fetch("/api/transaction/bulk-create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create transaction");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("transactions created");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create transactions");
    },
  });

  return mutation;
};

export default useBulkCreateTransactions;
