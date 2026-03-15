import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import API from "../../Api/api";
import Swal from "sweetalert2";
import { useBlogsInfinite } from "../../hooks/useBlogsInfinite";

const LIMIT = 5;

const BlogList = () => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBlogsInfinite({ category: "All", limit: LIMIT, isAdmin: true });

  const blogs = useMemo(() => {
    return data?.pages?.flatMap((p) => p.blogs) ?? [];
  }, [data]);

  const toggleMutation = useMutation({
    mutationFn: async (blogId) => {
      const res = await API.post("/blog/toggle-blog", { blogId });
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to update blog");
      }
      return res.data;
    },
    onMutate: () => toast.loading("Updating blog status...", { id: "toggle" }),
    onSuccess: (data) => {
      toast.success(data.message || "Updated!", { id: "toggle" });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: (err) => {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update blog status";

      toast.error(message, { id: "toggle" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (blogId) => {
      const res = await API.post("/blog/delete-blog", { blogId });
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to delete blog");
      }
      return res.data;
    },
    onMutate: () => toast.loading("Deleting blog...", { id: "delete" }),
    onSuccess: (data) => {
      toast.success(data.message || "Deleted!", { id: "delete" });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: (err) => {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update blog status";

      toast.error(message, { id: "delete" });
    },
  });

  const disableAll = toggleMutation.isPending || deleteMutation.isPending;

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

  if (isError) {
    return <div className="mt-10 ml-10 text-red-600">{error?.message}</div>;
  }

  return (
    <div className="w-full min-w-0 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">
          Publications Space
        </h1>
        <p className="text-gray-500 font-medium tracking-wide">
          Manage, moderate, and publish content.
        </p>
      </div>

      <div className="w-full min-w-0 bg-white rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100/60 overflow-hidden relative flex-1 flex flex-col">
        <div className="px-6 lg:px-8 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <div className="text-sm font-semibold text-gray-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            {isFetching && !isFetchingNextPage
              ? "Syncing publications..."
              : "All Data Synced"}
          </div>
        </div>

        <div className="w-full min-w-0 flex-1 relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-1 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center rounded-[2rem]">
              <div className="flex flex-col items-center gap-3 bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
                <div className="h-10 w-10 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-sm font-bold text-gray-700">Loading catalog...</p>
              </div>
            </div>
          )}

          <table className="w-full table-auto border-collapse text-left">
            <thead>
              <tr className="bg-white border-b border-gray-100/80 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                <th className="px-4 lg:px-6 py-4 w-[6%] whitespace-nowrap">#</th>
                <th className="px-4 lg:px-6 py-4 w-[34%]">Title</th>
                <th className="px-4 lg:px-6 py-4 w-[14%] whitespace-nowrap">Created</th>
                <th className="px-4 lg:px-6 py-4 w-[14%] whitespace-nowrap">State</th>
                <th className="px-4 lg:px-6 py-4 w-[14%] whitespace-nowrap">Visibility</th>
                <th className="px-4 lg:px-6 py-4 w-[8%] text-center whitespace-nowrap">Trash</th>
                <th className="px-4 lg:px-6 py-4 w-[10%] whitespace-nowrap">Moderator</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {blogs.map((blog, index) => (
                <tr key={blog._id} className="group hover:bg-gray-50/50 transition-colors align-middle">
                  <td className="px-4 lg:px-6 py-5 text-sm font-semibold text-gray-400 whitespace-nowrap">
                    {(index + 1).toString().padStart(2, "0")}
                  </td>

                  <td className="px-4 lg:px-6 py-5 min-w-0">
                    <div className="min-w-0">
                      <p className="text-sm lg:text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors break-words leading-6">
                        {blog.title}
                      </p>
                      <p className="text-[11px] font-medium text-gray-500 mt-2 uppercase tracking-wide bg-gray-100 inline-block px-2 py-0.5 rounded-md">
                        ID: {blog._id.slice(-6)}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 lg:px-6 py-5 text-sm text-gray-600 font-medium whitespace-nowrap">
                    {blog.createdAt
                      ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </td>

                  <td className="px-4 lg:px-6 py-5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide ${
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
                      {blog.isPublished ? "PUBLISHED" : "DRAFT"}
                    </span>
                  </td>

                  <td className="px-4 lg:px-6 py-5 whitespace-nowrap">
                    <button
                      onClick={() => handleTogglePublish(blog._id, blog.isPublished)}
                      disabled={disableAll || toggleMutation.isPending}
                      className={`min-w-[110px] px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all ${
                        blog.isPublished
                          ? "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
                          : "bg-gray-900 text-white hover:bg-black shadow-[0_4px_10px_rgb(0,0,0,0.1)] hover:-translate-y-0.5"
                      } disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none`}
                    >
                      {toggleMutation.isPending
                        ? "Wait..."
                        : blog.isPublished
                        ? "Hide"
                        : "Make Live"}
                    </button>
                  </td>

                  <td className="px-4 lg:px-6 py-5 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleRemove(blog._id)}
                      disabled={disableAll || deleteMutation.isPending}
                      className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-red-50/50 text-red-500 hover:bg-red-500 hover:text-white transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                      title="Route to trash"
                    >
                      {deleteMutation.isPending ? (
                        "..."
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      )}
                    </button>
                  </td>

                  <td className="px-4 lg:px-6 py-5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs shadow-sm shadow-indigo-100 shrink-0">
                        {blog.moderatedBy?.fullName
                          ? blog.moderatedBy.fullName.charAt(0)
                          : "S"}
                      </div>
                      <span className="text-sm font-semibold text-gray-700 break-words">
                        {blog.moderatedBy?.fullName || "System"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {blogs.length === 0 && !isLoading && !isError && (
            <div className="flex flex-col items-center justify-center py-24 text-center px-4 border-t border-gray-50">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No Publications Found
              </h3>
              <p className="text-gray-500 font-medium">
                Try adjusting filters or submit a new story.
              </p>
            </div>
          )}
        </div>

        <div className="px-8 py-6 flex justify-center border-t border-gray-100 bg-white mt-auto">
          {hasNextPage ? (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="group relative inline-flex items-center justify-center px-8 py-3 bg-white border border-gray-200 text-gray-900 font-bold tracking-wide rounded-full overflow-hidden transition-all hover:border-gray-300 hover:shadow-md disabled:opacity-50 disabled:hover:shadow-none"
            >
              <span className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              {isFetchingNextPage ? (
                <span className="relative flex items-center gap-3 text-indigo-600">
                  <div className="w-4 h-4 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
                  Fetching entries...
                </span>
              ) : (
                <span className="relative z-10">Load More Articles</span>
              )}
            </button>
          ) : (
            <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">
              End of Directory
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogList;