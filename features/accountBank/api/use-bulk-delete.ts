import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  DeleteBulkAccountBankSchema,
  DeleteBulkAccountBankSchemaType,
} from "@/schemas/accountBank";

type RequestType = DeleteBulkAccountBankSchemaType;

export const useDeleteBulkAccountBank = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: RequestType) => {
      const validation = DeleteBulkAccountBankSchema.safeParse(data);
      if (!validation.success) {
        throw new Error("Invalid request data");
      }

      const response = await fetch("/api/accountBank/bulk-delete", {
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
      queryClient.invalidateQueries({ queryKey: ["accountsBank"] });
      toast.success("Accounts deleted");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete accounts");
    },
  });

  return mutation;
};

export default useDeleteBulkAccountBank;
