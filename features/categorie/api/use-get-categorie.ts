import { useQuery } from "@tanstack/react-query";

export const useGetCategorie = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["categories", { id }],
    queryFn: async () => {
      const res = await fetch(`/api/categorie/${id}`);

      if (!res.ok) {
        throw new Error("Failed to fetch categorie");
      }

      const data = await res.json();

      return data;
    },
  });

  return query;
};

export default useGetCategorie;
