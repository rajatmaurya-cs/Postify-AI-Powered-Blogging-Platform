import { useInfiniteQuery } from "@tanstack/react-query";
import API from "../Api/api";

export function useBlogsInfinite({ category = "All", limit = 3 }) {
  return useInfiniteQuery({
    queryKey: ["blogs", category, limit],

    queryFn: async ({ pageParam = 1 }) => {
      const res = await API.get(
        `/blog/allblog?page=${pageParam}&limit=${limit}&category=${category}`
      );

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to fetch blogs");
      }


      return res.data;
    },

    
    getNextPageParam: (lastPage) => {
      
      return lastPage?.hasMore ? lastPage?.nextPage : undefined;
    },

    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}