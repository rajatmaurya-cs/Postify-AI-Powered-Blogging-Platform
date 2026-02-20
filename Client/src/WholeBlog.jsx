
import React, { useContext, useEffect, useMemo, useState, Suspense, lazy } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

import { Report } from 'notiflix/build/notiflix-report-aio';

import { assets } from "./assets/assets";

import API from "./Api/api";

const Loader = lazy(() => import("./Effects/Summarising"));

import Button from "./Effects/Button";

import { AuthContext } from "./Context/Authcontext";

import { useBlogById } from "./hooks/useBlogById";

import { useCommentsByBlog } from "./hooks/useCommentsByBlog";



const WholeBlog = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isLoggedIn } = useContext(AuthContext);


  const { data: blog, isLoading: blogLoading, isError: blogError } = useBlogById(blogId);
  const { data: comments = [], isLoading: commentsLoading } = useCommentsByBlog(blogId);


  const [comment, setComment] = useState("");
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [aicontent, setaicontent] = useState(false);


  useEffect(() => {
    if (blog?.content) {
      setContent(blog.content);
      setOriginalContent(blog.content);
      setaicontent(false);
    }
  }, [blogId, blog?.content]);


  const approvedComments = useMemo(
    () => comments.filter((c) => c.isApproved),
    [comments]
  );


  const contentHtml = useMemo(() => ({ __html: content }), [content]);


  const addCommentMutation = useMutation({
    mutationFn: async () => {
      const res = await API.post("/comment/addcomment", { content: comment, blogId });
      if (!res.data?.success) throw new Error(res.data?.message || "Comment failed");
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Comment added");
      setComment("");

      queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
    },
    onError: (err) => toast.error(err.message || "Comment failed"),
  });



  const summariseMutation = useMutation({
    mutationFn: async () => {
      const res = await API.post("/ai/summarise", { content });
      if (!res.data?.success) throw new Error(res.data?.message || "Summarise failed");
      return res.data.content;
    },
    onSuccess: (newContent) => {
      setContent(newContent);
      setaicontent(true);
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";


      if (msg.toLowerCase().includes("limit")) {
        Report.failure(
          "Daily AI Limit Reached",
          "Try again tomorrow",
          "Okay"
        );
      } else {

        toast.error(msg);
      }

    }
  });


  const ailoading = summariseMutation.isPending;

  useEffect(() => {
    document.body.style.overflow = ailoading ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [ailoading]);

  const handlecomments = (e) => {
    e.preventDefault();
    if (!comment.trim()) return toast.error("Write a comment first");
    addCommentMutation.mutate();
  };

  const handleGoback = () => {
    setContent(originalContent);
    setaicontent(false);
  };


  if (blogLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading blog...
      </div>
    );
  }

  if (blogError || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Failed to load blog.
      </div>
    );
  }

  return (
    <div className="relative">
      <img
        src={assets.BackGround}
        alt="background"
        loading="lazy"
        decoding="async"
        className="fixed inset-0 w-screen h-screen object-cover -z-10"
      />

      <div className="relative overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-6 py-16 text-center">
          <p className="text-sm text-gray-500 mb-2">
            Published on{" "}
            {new Date(blog.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-700 mb-4">
            {blog.title}
          </h1>

          <p className="text-sm text-gray-600">
            In <span className="font-medium">{blog.category}</span>
          </p>

          <div className="flex justify-center mt-5">
            <span className="px-4 py-1 text-sm rounded-full bg-gray-100 text-gray-700">
              {blog.createdBy?.fullName}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-5 py-12 flex flex-col items-center">
        <div className="rounded-2xl overflow-hidden shadow-lg mb-10 max-w-5xl">
          <img
            src={blog.image}
            alt={blog.title}
            loading="lazy"
            decoding="async"
            className="w-full h-auto object-cover"
          />
        </div>

        {ailoading && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="rounded-2xl bg-white/80 border border-white/40 shadow-2xl px-6 py-5">
              <Loader />
              <p className="mt-3 text-sm text-gray-700 text-center font-medium">
                Summarising...
              </p>
            </div>
          </div>
        )}

        <div className="relative max-w-full">
          <div className="rich-text max-w-4/5 mx-auto" dangerouslySetInnerHTML={contentHtml} />
        </div>
      </div>

      <div className="flex justify-center items-center mt-8 mb-8">

        {ailoading && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="rounded-2xl bg-white/80 border border-white/40 shadow-2xl px-6 py-5">

              <Suspense fallback={<div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-700" />}>
                <Loader />
              </Suspense>

              <p className="mt-3 text-sm text-gray-700 text-center font-medium">
                Summarising...
              </p>
            </div>
          </div>
        )}

        {isLoggedIn && aicontent && (
          <button
            className="px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
            onClick={handleGoback}
          >
            🔙 Go Back
          </button>
        )}

        {!isLoggedIn && (
          <button className="px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition">
            🔐 ✨ AI Summariser
          </button>
        )}
      </div>

      <div className="mt-5 mx-auto max-w-5xl rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 flex items-center justify-center gap-2 text-center">
        <span>⚠️</span>
        <span className="font-semibold">Note:</span>
        <span>
          This app is currently in development. You get <b>1</b> summarization attempt per day.
        </span>
      </div>

      {isLoggedIn ? (
        <>
          <div className="max-w-3xl mx-auto px-5 mt-12">
            <form onSubmit={handlecomments} className="bg-white rounded-2xl p-6 shadow-md border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                💬 Join the discussion
              </h3>

              <textarea
                placeholder="Write something thoughtful..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-500">
                  Total comments:{" "}
                  <span className="font-medium">{approvedComments.length}</span>
                </p>

                <button
                  type="submit"
                  disabled={addCommentMutation.isPending}
                  className="px-6 py-2 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition disabled:opacity-60"
                >
                  {addCommentMutation.isPending ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </form>
          </div>

          <div className="max-w-3xl mx-auto px-5 mt-10 space-y-4">
            {commentsLoading ? (
              <p className="text-center text-gray-500 text-sm">Loading comments...</p>
            ) : approvedComments.length === 0 ? (
              <p className="text-center text-gray-500 text-sm">
                No comments yet. Be the first to share your thoughts ✨
              </p>
            ) : (
              approvedComments.map((c) => (
                <div
                  key={c._id}
                  className="flex gap-4 bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition"
                >
                  <img
                    src={c.createdBy?.avatar || assets.user_icon}
                    alt="user"
                    loading="lazy"
                    decoding="async"
                    className="w-11 h-11 rounded-full border"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">
                        {c.createdBy?.fullName || "User"}
                      </p>
                      <span className="text-xs text-gray-400">
                        {/* replace Moment for speed later */}
                        {new Date(c.createdAt).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mt-1 leading-relaxed">{c.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="max-w-3xl mx-auto px-5 mt-14">
          <div
            onClick={() => navigate("/login")}
            className="cursor-pointer bg-gray-50 border rounded-2xl p-6 text-center hover:bg-gray-100 transition"
          >
            <p className="text-gray-700 text-lg">
              🔒 <span className="font-semibold">Login</span> to comment and use AI features
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WholeBlog;