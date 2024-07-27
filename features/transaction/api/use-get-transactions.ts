import { useQuery } from "@tanstack/react-query";

import { convertAmountFromMiliunits } from "@/lib/utils";

export const useGetTransactions = () => {
  const query = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await fetch("/api/transaction");

      if (!res.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await res.json();

      return data.map((transaction: any) => ({
        ...transaction,
        amount: convertAmountFromMiliunits(transaction.amount),
      }));
    },
  });

  return query;
};

export default useGetTransactions;
