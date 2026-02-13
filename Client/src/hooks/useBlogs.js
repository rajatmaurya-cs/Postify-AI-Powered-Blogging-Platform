import { useQuery } from "@tanstack/react-query";
import API from "../Api/api";

const fetchBlogs = async () => {
  const res = await API.get("/blog/allblog");
  return res.data.blogs || [];
};

export const useBlogs = () => {
  return useQuery({
    queryKey: ["blogs", "all"],
    queryFn: fetchBlogs,
    staleTime: 60_000,
    gcTime: 10 * 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
