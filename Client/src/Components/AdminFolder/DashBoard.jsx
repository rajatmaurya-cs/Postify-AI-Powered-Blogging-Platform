import React, {useMemo } from "react";
import { assets } from "../../assets/assets";
import API from "../../Api/api";
import toast from "react-hot-toast";
import { useBlogs } from "../../hooks/useBlogs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const DashBoard = () => {
  const queryClient = useQueryClient();

   



  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await API.get("/blog/BlogDashBoard");
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to load dashboard stats");
      }
      const { totalBlogs = 0, totalComments = 0, draftBlogs = 0 } = res.data.stats || {};
      return { totalBlogs, totalComments, draftBlogs };
    },
    staleTime: 30_000, 
  });

  const { data: blogs = [], isLoading, isError, error, isFetching } = useBlogs();

  const latestBlogs = useMemo(() => {
    return [...blogs]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4);
  }, [blogs]);

  const toggleMutation = useMutation({
    mutationFn: async (blogId) => {
      const res = await API.post("/blog/toggle-blog", { blogId });
      if (!res.data?.success) throw new Error(res.data?.message || "Failed to update blog");
      return res.data;
    },
    onMutate: () => toast.loading("Updating blog status...", { id: "toggle" }),
    onSuccess: (data) => {
      toast.success(data.message || "Updated!", { id: "toggle" });
      queryClient.invalidateQueries({ queryKey: ["blogs", "all"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] }); 
    },
    onError: (err) => toast.error(err?.message || "Failed to update blog status", { id: "toggle" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (blogId) => {
      const res = await API.post("/blog/delete-blog", { blogId });
      if (!res.data?.success) throw new Error(res.data?.message || "Failed to delete blog");
      return res.data;
    },
    onMutate: () => toast.loading("Deleting blog...", { id: "delete" }),
    onSuccess: (data) => {
      toast.success(data.message || "Deleted!", { id: "delete" });
      queryClient.invalidateQueries({ queryKey: ["blogs", "all"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] }); 
    },
    onError: (err) => toast.error(err?.message || "Failed to delete blog", { id: "delete" }),
  });

  const disableAll = toggleMutation.isPending || deleteMutation.isPending;

  const totalBlogs = stats?.totalBlogs ?? (statsLoading ? "..." : "-");
  const totalComments = stats?.totalComments ?? (statsLoading ? "..." : "-");
  const draftBlogs = stats?.draftBlogs ?? (statsLoading ? "..." : "-");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex mt-10 ml-10">
        <div className="flex">
          <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all mr-7">
            <img src={assets.dashboard_icon_1} alt="" />
            <div>
              <p>{totalBlogs}</p>
              <p>Blogs</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all mr-7">
            <img src={assets.dashboard_icon_2} alt="" />
            <div>
              <p>{totalComments}</p>
              <p>Comments</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all">
            <img src={assets.dashboard_icon_3} alt="" />
            <div>
              <p>{draftBlogs}</p>
              <p>Drafts</p>
            </div>
          </div>
        </div>
      </div>

      {statsError && <p className="ml-10 text-red-500">Dashboard stats failed to load</p>}

      {/* blogs section same as your code... */}
      {isLoading && <p className="ml-10 text-gray-500">Loading blogs...</p>}
      {isError && <p className="ml-10 text-red-500">Error: {error?.message}</p>}
      {!isLoading && !isError && isFetching && <p className="ml-10 text-gray-500">Updating...</p>}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden max-w-4xl ml-10">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr className="text-gray-600 text-sm">
              <th className="p-4">#</th>
              <th className="p-4">BLOG TITLE</th>
              <th className="p-4">DATE</th>
              <th className="p-4">STATUS</th>
              <th className="p-4">ACTIONS</th>
              <th className="p-4">REMOVE</th>
              <th className="p-4">ModeratedBy</th>
            </tr>
          </thead>

          <tbody>
            {latestBlogs.map((blog, index) => (
              <tr key={blog._id} className="border-b hover:bg-gray-50">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{blog.title}</td>
                <td className="p-4">
                  {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "—"}
                </td>
                <td className={`p-4 font-medium ${blog.isPublished ? "text-green-600" : "text-yellow-600"}`}>
                  {blog.isPublished ? "Published" : "Not Published"}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => toggleMutation.mutate(blog._id)}
                    disabled={disableAll}
                    className="bg-gray-300 hover:bg-gray-700 hover:text-white px-4 py-1 rounded-2xl disabled:opacity-60"
                  >
                    {toggleMutation.isPending ? "Updating..." : blog.isPublished ? "Unpublish" : "Publish"}
                  </button>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => deleteMutation.mutate(blog._id)}
                    disabled={disableAll}
                    className="bg-gray-300 hover:bg-gray-700 px-4 py-1 w-25 rounded-2xl disabled:opacity-60"
                    title="Delete blog"
                  >
                    {deleteMutation.isPending ? "..." : "❌"}
                  </button>
                </td>
                <td className="p-4 font-medium">{blog.moderatedBy?.fullName || "NONE"}</td>
              </tr>
            ))}

            {latestBlogs.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={7}>
                  No blogs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashBoard;
