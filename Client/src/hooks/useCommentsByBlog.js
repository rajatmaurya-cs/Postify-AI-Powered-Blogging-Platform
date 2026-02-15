import { useQuery } from "@tanstack/react-query";
import API from "../Api/api";

export function useCommentsByBlog(blogId) {
  return useQuery({
    queryKey: ["comments", blogId],
    queryFn: async () => {
      const res = await API.get(`/comment/allcomment/${blogId}`);
      if (!res.data?.success) throw new Error(res.data?.message || "Comments fetch failed");
      return res.data.comments || [];
    },
    enabled: !!blogId,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
