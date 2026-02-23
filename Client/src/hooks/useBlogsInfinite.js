
import { useInfiniteQuery } from "@tanstack/react-query";


import API from "../Api/api";

export function useBlogsInfinite({category = "All", limit = 3, isAdmin = false,
}) {
  const endpoint = isAdmin ? "blog/admin/blogs" : "/blog/allblog";

  return useInfiniteQuery({
    queryKey: ["blogs", category, limit, isAdmin],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await API.get(
        `${endpoint}?page=${pageParam}&limit=${limit}&category=${category}`
      );
      if (!res.data?.success) throw new Error(res.data?.message || "Failed");
      return res.data;
    },
    getNextPageParam: (lastPage) =>
      lastPage?.hasMore ? lastPage?.nextPage : undefined,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
