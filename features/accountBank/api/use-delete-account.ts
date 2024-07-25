import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteAccountBank = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/accountBank/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove account");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accountsBank"] });
      queryClient.invalidateQueries({ queryKey: ["accountsBank", { id }] });
      toast.success("Account deleted");
    },
    onError: () => {
      toast.error("Failed to remove account");
    },
  });

  return mutation;
};

export default useDeleteAccountBank;
