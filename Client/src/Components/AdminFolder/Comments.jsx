import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import API from "../../Api/api";
import Swal from "sweetalert2";
import Moment from "moment";

const Comments = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");

  const {
    data: allComments = [],
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["comments"],
    queryFn: async () => {
      const res = await API.get("/comment/comments");
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to load comments");
      }
      return res.data.comments || [];
    },
    staleTime: 20_000,
  });

  const comments = useMemo(() => {
    if (filter === "approved") return allComments.filter((c) => c.isApproved);
    if (filter === "pending") return allComments.filter((c) => !c.isApproved);
    return allComments;
  }, [allComments, filter]);

  const toggleMutation = useMutation({
    mutationFn: async (commentId) => {
      const res = await API.post("/comment/toggle-comment", { commentId });
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to update comment");
      }
      return res.data;
    },
    onMutate: () => toast.loading("Updating comment...", { id: "toggle-comment" }),
    onSuccess: (data) => {
      toast.success(data?.message || "Updated!", { id: "toggle-comment" });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (err) => {
      const message =
        err?.response?.data?.message || err?.message || "Failed to update comment status";

      toast.error(message, { id: "toggle-comment" });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (commentId) => {
      const res = await API.post("/comment/removecomment", { commentId });
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to remove comment");
      }
      return res.data;
    },
    onMutate: () => toast.loading("Removing comment...", { id: "remove-comment" }),
    onSuccess: (data) => {
      toast.success(data?.message || "Removed!", { id: "remove-comment" });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (err) => {
      const message = err?.response?.data?.message || err?.message || "Failed to Delete";
      toast.error(message, { id: "remove-comment" });
    },
  });

  const disableAll = toggleMutation.isPending || removeMutation.isPending;

  const handleRemove = async (commentId) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete this comment?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      removeMutation.mutate(commentId);
    }
  };

  const handleTogglePublish = async (commentId, isApproved) => {
    const action = isApproved ? "Unpublish" : "Publish";
    const actionText = isApproved
      ? "This will hide the Comment from users."
      : "This will make the Comment visible to users.";

    const result = await Swal.fire({
      icon: "warning",
      title: `${action} this Comment?`,
      text: actionText,
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: "Cancel",
      confirmButtonColor: isApproved ? "#d33" : "#16a34a",
    });

    if (result.isConfirmed) {
      toggleMutation.mutate(commentId);
    }
  };

  return (
    <div className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500 flex flex-col h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">
            Community Discussions
          </h1>
          <p className="text-gray-500 font-medium tracking-wide">
            Review and moderate user thoughts and feedback.
          </p>
        </div>

        <div className="inline-flex flex-wrap bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200/60 shadow-inner w-fit max-w-full">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all whitespace-nowrap ${
              filter === "all"
                ? "bg-white text-gray-900 shadow-[0_2px_10px_rgb(0,0,0,0.06)]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all whitespace-nowrap ${
              filter === "approved"
                ? "bg-emerald-50 text-emerald-700 shadow-[0_2px_10px_rgb(16,185,129,0.1)] border border-emerald-100"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all whitespace-nowrap ${
              filter === "pending"
                ? "bg-amber-50 text-amber-700 shadow-[0_2px_10px_rgb(245,158,11,0.1)] border border-amber-100"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Pending
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-4">
        {isError && (
          <div className="inline-flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 text-red-600 font-medium rounded-xl text-sm">
            ⚠️ {error?.message}
          </div>
        )}

        {!isLoading && !isError && isFetching && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-xl">
            <div className="w-3 h-3 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
            Refreshing discussions...
          </div>
        )}
      </div>

      <div className="w-full min-w-0 bg-white rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100/60 overflow-hidden relative flex-1 flex flex-col">
        {isLoading && (
          <div className="absolute inset-x-0 top-16 bottom-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
              <div className="h-10 w-10 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
              <p className="text-sm font-bold text-gray-700">Loading comments...</p>
            </div>
          </div>
        )}

       <div className="w-full min-w-0 flex-1 relative overflow-x-auto">
         <table className="min-w-[850px] w-full table-auto text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100 sticky top-0 z-10">
              <tr className="text-[11px] uppercase tracking-widest text-gray-400 font-bold">
                <th className="px-4 lg:px-6 py-4 w-[6%] whitespace-nowrap">#</th>
                <th className="px-4 lg:px-6 py-4 w-[16%] whitespace-nowrap">Author</th>
                <th className="px-4 lg:px-6 py-4 w-[34%]">Message</th>
                <th className="px-4 lg:px-6 py-4 w-[18%] whitespace-nowrap">Posted</th>
                <th className="px-4 lg:px-6 py-4 w-[12%] whitespace-nowrap">Status</th>
                <th className="px-4 lg:px-6 py-4 w-[10%] text-center whitespace-nowrap">Moderate</th>
                <th className="px-4 lg:px-6 py-4 w-[8%] text-center whitespace-nowrap">Trash</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {!isLoading && comments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-24 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
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
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No Discussions Found
                    </h3>
                    <p className="text-gray-500 font-medium">
                      Try changing your filter settings to see more results.
                    </p>
                  </td>
                </tr>
              ) : (
                comments.map((comment, index) => (
                  <tr key={comment._id} className="group hover:bg-gray-50/40 transition-colors align-middle">
                    <td className="px-4 lg:px-6 py-5 text-sm font-semibold text-gray-400 whitespace-nowrap">
                      {(index + 1).toString().padStart(2, "0")}
                    </td>

                    <td className="px-4 lg:px-6 py-5 min-w-0">
                      <p
                        className="text-sm font-bold text-gray-900 break-words leading-6"
                        title={comment.createdBy?.fullName}
                      >
                        {comment.createdBy?.fullName || "Anonymous"}
                      </p>
                    </td>

                    <td className="px-4 lg:px-6 py-5 min-w-0">
                      <p
                        className="text-sm text-gray-600 font-medium break-words leading-6"
                        title={comment.content}
                      >
                        {comment.content}
                      </p>
                    </td>

                    <td className="px-4 lg:px-6 py-5 text-sm text-gray-500 font-medium whitespace-nowrap">
                    {Moment(comment.createdAt).fromNow()}
                    </td>

                    <td className="px-4 lg:px-6 py-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide ${
                          comment.isApproved
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            comment.isApproved ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        ></span>
                        {comment.isApproved ? "APPROVED" : "PENDING"}
                      </span>
                    </td>

                    <td className="px-4 lg:px-6 py-5 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublish(comment._id, comment.isApproved)}
                        disabled={disableAll}
                        className={`min-w-[110px] px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all ${
                          comment.isApproved
                            ? "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
                            : "bg-gray-900 text-white hover:bg-black shadow-[0_4px_10px_rgb(0,0,0,0.1)] hover:-translate-y-0.5"
                        } disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none`}
                      >
                        {toggleMutation.isPending
                          ? "Wait..."
                          : comment.isApproved
                          ? "Hide"
                          : "Approve"}
                      </button>
                    </td>

                    <td className="px-4 lg:px-6 py-5 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleRemove(comment._id)}
                        disabled={disableAll}
                        className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                        title="Delete comment permanently"
                      >
                        {removeMutation.isPending ? (
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Comments;