import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  EditAccountBankSchema,
  EditAccountBankSchemaType,
} from "@/schemas/accountBank";

type RequestType = EditAccountBankSchemaType;

export const useEditAccountBank = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: RequestType) => {
      const validation = EditAccountBankSchema.safeParse(data);
      if (!validation.success) {
        throw new Error("Invalid request data");
      }

      const response = await fetch(`/api/accountBank/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to edit account");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accountsBank"] });
      queryClient.invalidateQueries({ queryKey: ["accountsBank", { id }] });
      toast.success("Account updated");
    },
    onError: () => {
      toast.error("Failed to edit account");
    },
  });

  return mutation;
};

export default useEditAccountBank;
