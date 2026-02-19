import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import API from "../../Api/api";
import { useBlogs } from "../../hooks/useBlogs";
import Swal from "sweetalert2";
const BlogList = () => {
  const queryClient = useQueryClient();

  const {
    data: blogs = [],
    isLoading,
    isError,
    error,
    isFetching,
  } = useBlogs();


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
      queryClient.invalidateQueries({ queryKey: ["blogs", "all"] }); 
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to update blog status", { id: "toggle" });
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
      queryClient.invalidateQueries({ queryKey: ["blogs", "all"] }); 
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to delete blog", { id: "delete" });
    },
  });


  

  if (isLoading) return <div className="mt-10 ml-10">Loading blogs...</div>;
  if (isError) return <div className="mt-10 ml-10 text-red-600">{error?.message}</div>;

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



  return (
    <div className="mt-10">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden max-w-4xl ml-10">
        <div className="p-3 text-sm text-gray-500">
          {isFetching ? "Refreshing..." : " "}
        </div>

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
            {blogs.map((blog, index) => (
              <tr key={blog._id} className="border-b hover:bg-gray-50">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{blog.title}</td>
                <td className="p-4">
                  {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "—"}
                </td>

                <td
                  className={`p-4 font-medium ${
                    blog.isPublished ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {blog.isPublished ? "Published" : "Not Published"}
                </td>

                <td className="p-4">
                  <button
                    onClick={() => handleTogglePublish(blog._id , blog.isPublished)}
                    disabled={disableAll}
                    className="bg-gray-300 hover:bg-gray-700 hover:text-white px-4 py-1 rounded-2xl disabled:opacity-60"
                  >
                    {toggleMutation.isPending
                      ? "Updating..."
                      : blog.isPublished
                      ? "Unpublish"
                      : "Publish"}
                  </button>
                </td>

                <td className="p-4">
                  <button
                    onClick={() => handleRemove(blog._id)}
                    disabled={disableAll}
                    className="bg-gray-300 hover:bg-gray-700 px-4 py-1 rounded-2xl disabled:opacity-60"
                    title="Delete blog"
                  >
                    {deleteMutation.isPending ? "..." : "❌"}
                  </button>
                </td>

                <td className="p-4 font-medium">
                  {blog.moderatedBy?.fullName || "NONE"}
                </td>
              </tr>
            ))}

            {blogs.length === 0 && (
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

export default BlogList;
