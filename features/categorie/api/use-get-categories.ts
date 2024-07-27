import { useQuery } from "@tanstack/react-query";

export const useGetCategories = () => {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categorie");

      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await res.json();

      return data;
    },
  });

  return query;
};

export default useGetCategories;
