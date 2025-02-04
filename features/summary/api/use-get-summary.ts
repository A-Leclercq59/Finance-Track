import { convertAmountFromMiliunits } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const useGetSummary = () => {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const accountBankId = searchParams.get("accountBankId") || "";

  const query = useQuery({
    queryKey: ["summary"],
    queryFn: async () => {
      const params = new URLSearchParams({ from, to, accountBankId });
      const res = await fetch(`/api/summary?${params.toString()}`);

      if (!res.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const { data } = await res.json();

      return {
        ...data,
        incomeAmount: convertAmountFromMiliunits(data.incomeAmount),
        expensesAmount: convertAmountFromMiliunits(data.expensesAmount),
        remainingAmount: convertAmountFromMiliunits(data.remainingAmount),
        categories: data.categories.map((categorie: any) => ({
          ...categorie,
          value: convertAmountFromMiliunits(categorie.value),
        })),
        days: data.days.map((day: any) => ({
          ...day,
          income: convertAmountFromMiliunits(day.income),
          expenses: convertAmountFromMiliunits(day.expenses),
        })),
      };
    },
  });

  return query;
};

export default useGetSummary;
