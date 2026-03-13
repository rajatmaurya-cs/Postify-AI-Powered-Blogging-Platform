
import { assets } from "../../assets/assets";

import API from "../../Api/api";

import toast from "react-hot-toast";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Swal from "sweetalert2";

import { useLatestBlogs } from "../../hooks/useLatestBlogs"

const LIMIT = 5;

const DashBoard = () => {

  const queryClient = useQueryClient();



  const {
    data: latestBlogs = [],
    isLoading,
    isError,
    error,
    isFetching,
  } = useLatestBlogs({ limit: LIMIT, isAdmin: true, category: "All" });







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
    enabled: !!latestBlogs?.length,
    staleTime: 30_000,
  });





  const toggleMutation = useMutation({
    mutationFn: async (blogId) => {
      const res = await API.post("/blog/toggle-blog", { blogId });
      if (!res.data?.success) throw new Error(res.data?.message || "Failed to update blog");
      return res.data;
    },
    onMutate: () => toast.loading("Updating blog status...", { id: "toggle" }),
    onSuccess: (data) => {
      toast.success(data.message || "Updated!", { id: "toggle" });
      queryClient.invalidateQueries({ queryKey: ["latest-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (err) => {
      const message =
        err?.response?.data?.message || err?.message || "Failed to update blog status";

      toast.error(message, { id: "toggle" });
    }
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
      queryClient.invalidateQueries({ queryKey: ["latest-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (err) => {
      const message =
        err?.response?.data?.message || err?.message || "Failed to Delete the blog";

      toast.error(message, { id: "toggle" });
    }
  });

  const disableAll = toggleMutation.isPending || deleteMutation.isPending;

  const totalBlogs = stats?.totalBlogs ?? (statsLoading ? "..." : "-");
  const totalComments = stats?.totalComments ?? (statsLoading ? "..." : "-");
  const draftBlogs = stats?.draftBlogs ?? (statsLoading ? "..." : "-");



  const handleRemove = async (blogId) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete this Blog?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(blogId);
    }
  };



  const handleTogglePublish = async (blogId, isPublished) => {
    const action = isPublished ? "Unpublish" : "Publish";
    const actionText = isPublished
      ? "This will hide the blog from users."
      : "This will make the blog visible to users.";

    const result = await Swal.fire({
      icon: "warning",
      title: `${action} this blog?`,
      text: actionText,
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: "Cancel",
      confirmButtonColor: isPublished ? "#d33" : "#16a34a",
    });

    if (result.isConfirmed) {
      toggleMutation.mutate(blogId);
    }
  };









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



      {isError && <p className="ml-10 text-red-500">Error: {error?.message}</p>}
      {!isLoading && !isError && isFetching && <p className="ml-10 text-gray-500">Updating...</p>}



      <div className="bg-white rounded-xl shadow-sm overflow-x-auto max-w-4xl ml-10">


        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <table className="w-full table-fixed text-left">
          <thead className="bg-gray-50 border-b">
            <tr className="text-gray-600 text-sm">
              <th className="p-4 w-12">#</th>
              <th className="p-4 w-[420px]">BLOG TITLE</th>
              <th className="p-4 w-28">DATE</th>
              <th className="p-4 w-36">STATUS</th>
              <th className="p-4 w-40">ACTIONS</th>
              <th className="p-4 w-28">REMOVE</th>
              <th className="p-4 w-40">ModeratedBy</th>
            </tr>
          </thead>

          <tbody>
            {latestBlogs.map((blog, index) => (
              <tr key={blog._id} className="border-b hover:bg-gray-50 align-top">
                <td className="p-4">{index + 1}</td>




                <td className="p-4 break-words whitespace-normal">
                  {blog.title}
                </td>



                <td className="p-4 whitespace-nowrap">
                  {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "—"}
                </td>

                <td className={`p-4 font-medium whitespace-nowrap ${blog.isPublished ? "text-green-600" : "text-yellow-600"}`}>
                  {blog.isPublished ? "Published" : "Not Published"}
                </td>

                <td className="p-4">
                  <button
                    className="w-28 bg-gray-300 hover:bg-gray-700 hover:text-white px-4 py-1 rounded-2xl disabled:opacity-60"
                    onClick={() => handleTogglePublish(blog._id, blog.isPublished)}
                    disabled={disableAll}
                  >
                    {blog.isPublished ? "Unpublish" : "Publish"}
                  </button>
                </td>

                <td className="p-4">
                  <button
                    className="w-20 bg-gray-300 hover:bg-gray-700 px-4 py-1 rounded-2xl disabled:opacity-60"
                    onClick={() => handleRemove(blog._id)}
                    disabled={disableAll}
                    title="Delete blog"
                  >
                    ❌
                  </button>
                </td>

                <td className="p-4 font-medium break-words">
                  {blog.moderatedBy?.fullName || "NONE"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>




    </div>
  );
};

export default DashBoard;
