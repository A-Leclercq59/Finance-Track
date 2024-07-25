import { useQuery } from "@tanstack/react-query";

export const useGetAccountBank = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["accountsBank", { id }],
    queryFn: async () => {
      const res = await fetch(`/api/accountBank/${id}`);

      if (!res.ok) {
        throw new Error("Failed to fetch accounts");
      }

      const data = await res.json();

      return data;
    },
  });

  return query;
};

export default useGetAccountBank;
