import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import API from "../../Api/api";
import Swal from "sweetalert2";
const Comments = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all"); 

  // 1 Fetch comments
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
      toast.error(err?.message || "Update failed", { id: "toggle-comment" });
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
      toast.error(err?.message || "Remove failed", { id: "remove-comment" });
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
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50">
      <div className="flex items-center justify-between max-w-4xl mx-auto px-6 py-3 rounded-lg">
        <h1 className="text-xl font-bold">Comments</h1>

        <div className="flex gap-3">
          <button
            onClick={() => setFilter("approved")}
            className="px-4 py-1 rounded-full bg-green-500 hover:bg-green-600 text-white transition"
          >
            Approved
          </button>

          <button
            onClick={() => setFilter("pending")}
            className="px-4 py-1 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white transition"
          >
            Not Approved
          </button>

          <button
            onClick={() => setFilter("all")}
            className="px-4 py-1 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition"
          >
            All
          </button>
        </div>
      </div>

    
      {isLoading && <p className="text-center mt-8 text-gray-500">Loading comments...</p>}
      {isError && <p className="text-center mt-8 text-red-500">{error?.message}</p>}
      {!isLoading && !isError && isFetching && (
        <p className="text-center mt-2 text-gray-500">Refreshing...</p>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden max-w-7xl mt-6">
        <table className="w-full text-left table-fixed">
          <thead className="bg-gray-50 border-b">
            <tr className="text-gray-600 text-sm">
              <th className="p-4 w-12">#</th>
              <th className="p-4 w-40">User</th>
              <th className="p-4 w-[200px]">Comment</th>
              <th className="p-4 w-44">Date</th>
              <th className="p-4 w-32">Status</th>
              <th className="p-4 w-40 text-center">Actions</th>
              <th className="p-4 w-24 text-center">Remove</th>
              <th className="p-4 w-40">Moderated By</th>
            </tr>
          </thead>

          <tbody>
            {!isLoading && comments.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-10 text-gray-400 font-medium">
                  No Comments Found
                </td>
              </tr>
            ) : (
              comments.map((comment, index) => (
                <tr key={comment._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 text-gray-600">{index + 1}</td>

                  <td
                    className="p-4 text-gray-600 truncate max-w-[160px]"
                    title={comment.createdBy?.fullName}
                  >
                    {comment.createdBy?.fullName}
                  </td>

                  <td
                    className="p-4 font-medium text-gray-700 truncate max-w-[200px]"
                    title={comment.content}
                  >
                    {comment.content}
                  </td>

                  <td className="p-4 text-gray-600 text-sm">
                    {comment.createdAt
                      ? new Date(comment.createdAt).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        })
                      : "—"}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        comment.isApproved
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {comment.isApproved ? "Published" : "Pending"}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleTogglePublish(comment._id,comment.isApproved)}
                      disabled={disableAll}
                      className="bg-gray-200 hover:bg-gray-800 hover:text-white transition px-4 py-1 rounded-full text-sm disabled:opacity-60"
                    >
                      {toggleMutation.isPending ? "..." : comment.isApproved ? "Unpublish" : "Publish"}
                    </button>
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleRemove(comment._id)}
                      disabled={disableAll}
                      className="bg-red-100 hover:bg-red-600 hover:text-white transition px-3 py-1 rounded-full disabled:opacity-60"
                    >
                      {removeMutation.isPending ? "..." : "❌"}
                    </button>
                  </td>

                  <td
                    className="p-4 font-medium truncate max-w-[160px]"
                    title={comment.moderatedBy?.fullName}
                  >
                    {comment.moderatedBy?.fullName || "NONE"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Comments;
