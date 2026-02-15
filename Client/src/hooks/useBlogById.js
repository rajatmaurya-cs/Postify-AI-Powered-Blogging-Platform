import { useQuery } from "@tanstack/react-query";
import API from "../Api/api";

export function useBlogById(blogId) {
  return useQuery({
    queryKey: ["blog", blogId],
    queryFn: async () => {
      const res = await API.get(`/blog/blogbyid/${blogId}`);
      if (!res.data?.success) throw new Error(res.data?.message || "Blog fetch failed");
      return res.data.blog;
    },
    enabled: !!blogId,
    staleTime: 1000 * 60 * 5,     // 5 min cache fresh
    gcTime: 1000 * 60 * 30,       // keep cache 30 min
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
