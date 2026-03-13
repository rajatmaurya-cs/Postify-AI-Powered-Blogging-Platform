import { useQuery } from "@tanstack/react-query";
import API from "../Api/api";

export function useLatestBlogs({ limit = 5, isAdmin = true, category = "All" }) {
  
  const endpoint =  "blog/admin/blogs" 

  return useQuery({
    queryKey: ["latest-blogs", category, limit, isAdmin],
    queryFn: async () => {
      const res = await API.get(
        `${endpoint}?page=1&limit=${limit}&category=${encodeURIComponent(category)}`
      );

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to fetch latest blogs");
      }

      return res.data.blogs || [];
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}