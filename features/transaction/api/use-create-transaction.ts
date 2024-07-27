import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/schemas/transaction";

type RequestType = CreateTransactionSchemaType;

const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: RequestType) => {
      const validation = CreateTransactionSchema.safeParse(data);

      if (!validation.success) {
        throw new Error("Invalid request data");
      }

      const response = await fetch("/api/transaction", {
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
      toast.success("Transaction created");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create transaction");
    },
  });

  return mutation;
};

export default useCreateTransaction;
