import { useQuery } from "@tanstack/react-query";

import { convertAmountFromMiliunits } from "@/lib/utils";

export const useGetTransaction = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["transactions", { id }],
    queryFn: async () => {
      const res = await fetch(`/api/transaction/${id}`);

      if (!res.ok) {
        throw new Error("Failed to fetch transaction");
      }

      const data = await res.json();

      return {
        ...data,
        amount: convertAmountFromMiliunits(data.amount),
      };
    },
  });

  return query;
};

export default useGetTransaction;
