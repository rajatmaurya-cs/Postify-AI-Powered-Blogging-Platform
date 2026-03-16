
import { assets } from "../../assets/assets";

import { useNavigate } from "react-router-dom";


import { ArrowBigLeft } from 'lucide-react';

import API from "../../Api/api";

import toast from "react-hot-toast";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Swal from "sweetalert2";

import { useLatestBlogs } from "../../hooks/useLatestBlogs"

const LIMIT = 5;

const DashBoard = () => {

  const navigate = useNavigate();

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





  const disableAll = toggleMutation.isPending;

  const totalBlogs = stats?.totalBlogs ?? (statsLoading ? "..." : "-");
  const totalComments = stats?.totalComments ?? (statsLoading ? "..." : "-");
  const draftBlogs = stats?.draftBlogs ?? (statsLoading ? "..." : "-");



  


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
    <div className="flex flex-col h-full bg-white backdrop-blur-3xl animate-in fade-in duration-500">

      {/* Header Area */}
      <div className="p-8 lg:p-10 border-b border-gray-100/80 bg-white/40 sticky top-0 z-10 backdrop-blur-xl">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">Workspace Overview</h1>
        <p className="text-gray-500 font-medium tracking-wide">Manage your insights, stories, and community.</p>
      </div>

      <div className="flex-1 overflow-y-auto w-full max-h-[calc(100vh-250px)]">
        <div className="p-8 lg:p-10 space-y-10">

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all hover:-translate-y-1">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <img src={assets.dashboard_icon_1} className="w-7 h-7 object-contain opacity-70 group-hover:opacity-100" alt="" />
                </div>
                <div>
                  <p className="text-3xl font-black text-gray-900 tracking-tight">{totalBlogs}</p>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Total Stories</p>
                </div>
              </div>
            </div>

            <div className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all hover:-translate-y-1">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <img src={assets.dashboard_icon_2} className="w-7 h-7 object-contain opacity-70 group-hover:opacity-100" alt="" />
                </div>
                <div>
                  <p className="text-3xl font-black text-gray-900 tracking-tight">{totalComments}</p>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Discussions</p>
                </div>
              </div>
            </div>

            <div className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all hover:-translate-y-1">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <img src={assets.dashboard_icon_3} className="w-7 h-7 object-contain opacity-70 group-hover:opacity-100" alt="" />
                </div>
                <div>
                  <p className="text-3xl font-black text-gray-900 tracking-tight">{draftBlogs}</p>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">In Draft</p>
                </div>
              </div>
            </div>
          </div>

          {/* State Messages */}
          <div className="space-y-2">
            {statsError && (
              <div className="px-4 py-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 inline-block">
                ⚠️ Dashboard stats failed to load
              </div>
            )}
            {isError && (
              <div className="px-4 py-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 inline-block">
                ⚠️ {error?.message}
              </div>
            )}
            {!isLoading && !isError && isFetching && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-xl">
                <div className="w-3 h-3 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
                Refreshing data...
              </div>
            )}
          </div>

          {/* Recent Content Table */}
         <div className="w-full">
  {isLoading && (
    <div className="absolute inset-x-0 top-20 bottom-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-gray-500 tracking-wide animate-pulse">Loading workspace...</p>
      </div>
    </div>
  )}

  <table className="w-full text-left border-collapse table-auto">
    <thead>
      <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-widest text-gray-400 font-bold">
        <th className="px-6 py-5 w-16">ID</th>
        <th className="px-6 py-5">Story Title</th>
        <th className="px-6 py-5 w-32">Date</th>
        <th className="px-6 py-5 w-28">Status</th>
        <th className="px-6 py-5 w-36">Visibility</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-50">
      {latestBlogs.map((blog, index) => (
        <tr key={blog._id} className="group hover:bg-gray-50/50 transition-colors">
          <td className="px-6 py-6 text-sm font-semibold text-gray-400">
            {(index + 1).toString().padStart(2, "0")}
          </td>
          <td className="px-6 py-6">
            <p className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 pr-2">
              {blog.title}
            </p>
            <p className="text-xs text-gray-500 mt-1.5 font-bold uppercase tracking-wide bg-gray-100 inline-block px-2.5 py-1 rounded-md">
              {blog.category}
            </p>
          </td>
          <td className="px-6 py-6 text-sm text-gray-600 font-medium whitespace-nowrap">
            {blog.createdAt
              ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "—"}
          </td>
          <td className="px-6 py-6">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                blog.isPublished
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : "bg-amber-50 text-amber-700 border border-amber-100"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  blog.isPublished ? "bg-emerald-500" : "bg-amber-500"
                }`}
              ></span>
              {blog.isPublished ? "LIVE" : "DRAFT"}
            </span>
          </td>
          <td className="px-6 py-6">
            <button
              className={`w-full relative overflow-hidden whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all ${
                blog.isPublished
                  ? "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
                  : "bg-gray-900 text-white hover:bg-black shadow-[0_4px_10px_rgb(0,0,0,0.1)] hover:-translate-y-0.5"
              } disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none`}
              onClick={() => handleTogglePublish(blog._id, blog.isPublished)}
              disabled={disableAll}
            >
              {blog.isPublished ? "Unpublish" : "Publish"}
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {latestBlogs.length === 0 && !isLoading && !isError && (
    <div className="py-20 text-center border-t border-gray-50">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h4 className="text-lg font-bold text-gray-900 mb-1">No Activity Yet</h4>
      <p className="text-gray-500 font-medium">When you write stories, they will appear here.</p>
    </div>
  )}
</div>

         
          <div className="flex justify-center pt-4 pb-4">
            <button
              onClick={() => navigate("/")}
              className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-900 font-bold tracking-wide shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-md hover:border-gray-300 transition-all hover:-translate-y-0.5"
            >
              <div className="bg-gray-100 p-1.5 rounded-full group-hover:bg-gray-900 group-hover:text-white transition-colors">
                <ArrowBigLeft size={16} />
              </div>
              Back to Public Site
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashBoard;
