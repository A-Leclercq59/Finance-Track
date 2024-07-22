import { useQuery } from "@tanstack/react-query";

export const useGetAccountsBank = () => {
  const query = useQuery({
    queryKey: ["accountsBank"],
    queryFn: async () => {
      const res = await fetch("/api/accountBank");

      if (!res.ok) {
        throw new Error("Failed to fetch accounts");
      }

      const data = await res.json();

      return data;
    },
  });

  return query;
};

export default useGetAccountsBank;
