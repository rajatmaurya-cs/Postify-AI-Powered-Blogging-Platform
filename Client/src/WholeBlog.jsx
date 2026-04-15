import React, { useContext, useEffect, useMemo, useState, Suspense, lazy , useRef } from "react";
import Moment from "moment";
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
    const contentRef = useRef(null);
  const { blogId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isLoggedIn } = useContext(AuthContext);


  const { data: blog, isLoading: blogLoading, isError: blogError } = useBlogById(blogId);
  
  const { data: comments = [], isLoading: commentsLoading } = useCommentsByBlog(blogId, !!blog);


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
     onError: (err) => {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to Add The comment";

      toast.error(message, { id: "toggle" });
    },
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
  if (aicontent && !ailoading) {
    contentRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }
}, [aicontent, ailoading]);



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
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="flex items-center gap-3 px-6 py-4 bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100">
          <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-gray-600 tracking-wide">Loading story...</span>
        </div>
      </div>
    );
  }

  if (blogError || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="px-8 py-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-red-100 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">⚠️</span>
          </div>
          <h3 className="text-gray-900 font-semibold mb-1">Story Unavailable</h3>
          <p className="text-sm text-gray-500">We couldn't load this article.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#fafbfc] selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      <img
        src={assets.BackGround}
        alt="background"
        loading="lazy"
        decoding="async"
        className="fixed inset-0 w-screen h-screen object-cover opacity-30 blur-3xl -z-10"
      />

      <article className="relative w-[100%] mx-auto px-6 py-20 md:py-32">
        <header className="text-center mb-16 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/60 border border-gray-200 shadow-sm backdrop-blur-md hover:bg-white transition-colors cursor-default">
            <span className="text-xs font-bold tracking-widest uppercase text-gray-800">
              {blog.category}
            </span>
          </div>

          <h1 className="max-w-[700px] mx-auto text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 leading-tight">
            {blog.title}
          </h1>

          <div className="flex items-center justify-center gap-4 text-sm font-medium text-gray-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-200 to-gray-400 p-[2px] shadow-sm transform transition hover:scale-105">
                <img
                  src={blog.createdBy?.avatar || assets.user_icon}
                  className="w-full h-full rounded-full border-2 border-white object-cover"
                  alt="Author avatar"
                />
              </div>
              <span className="text-base text-gray-900 font-semibold tracking-tight">{blog.createdBy?.fullName}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span className="tracking-wide">
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </header>

        <div className="w-[60%] mx-auto rounded-[2rem] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] mb-16 ring-1 ring-gray-900/5 relative group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <img
            src={blog.image}
            alt={blog.subTitle}
            loading="lazy"
            decoding="async"
            className="w-full h-auto object-cover transform transition-transform duration-1000 group-hover:scale-105"
          />
        </div>

        {ailoading && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/20 backdrop-blur-md transition-all">
            <div className="bg-white/90 backdrop-blur-xl border border-white shadow-2xl rounded-3xl p-8 flex flex-col items-center gap-4 min-w-[280px] transform animate-in zoom-in-95 duration-300">
              <Suspense fallback={<div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />}>
                <Loader />
              </Suspense>
              <p className="text-sm text-gray-600 font-semibold tracking-wide animate-pulse">
                Distilling wisdom...
              </p>
            </div>
          </div>
        )}

        <div   ref={contentRef}  
        className="prose prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-indigo-600 prose-a:decoration-indigo-300 hover:prose-a:decoration-indigo-600 prose-img:rounded-3xl prose-blockquote:border-l-4 prose-blockquote:border-gray-900 prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:text-gray-700">
          <div className="rich-text" dangerouslySetInnerHTML={contentHtml} />
        </div>

        <div className="my-16 flex flex-col items-center gap-6 border-y border-gray-100 py-12">
          {isLoggedIn && !aicontent && (
            <button
              disabled={ailoading}
              onClick={() => summariseMutation.mutate()}
              className=""
            >

              {ailoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Summarising...
                </span>
              ) : (
                <span className="flex items-center gap-2">
              
                    <Button />
                
                </span>
              )}
            </button>
          )}

          {isLoggedIn && aicontent && (
            <button
              onClick={handleGoback}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white border border-gray-200 text-gray-900 font-semibold tracking-wide rounded-full shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Read Original
            </button>
          )}

          {!isLoggedIn && (
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-medium rounded-full shadow-lg opacity-80 cursor-not-allowed">
              <span className="text-xl">✨</span>
              <span className="tracking-wide">Login to Summarise</span>
            </button>
          )}

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-2xl border border-amber-100/50">
            <span className="text-amber-500 text-sm">✦</span>
            <p className="text-xs font-medium text-amber-700/80">
              AI Summariser involves a 1-request daily limit during beta.
            </p>
          </div>
        </div>

        {isLoggedIn ? (
          <section className="mt-20">
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-100">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-6 flex items-center gap-3">
                <span>Discussion</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full font-semibold">{approvedComments.length}</span>
              </h3>

              <form onSubmit={handlecomments} className="relative mb-12">
                <textarea
                  placeholder="Share your perspective..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50/50 px-6 py-5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:bg-white transition-all placeholder:text-gray-400 font-medium"
                />

                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    disabled={addCommentMutation.isPending || !comment.trim()}
                    className="inline-flex items-center px-8 py-3 rounded-full bg-gray-900 text-white font-semibold tracking-wide hover:shadow-lg hover:shadow-gray-900/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    {addCommentMutation.isPending ? "Posting..." : "Publish"}
                  </button>
                </div>
              </form>

              <div className="space-y-6">
                {commentsLoading ? (
                  <div className="flex items-center gap-3 text-gray-400 py-8 px-4">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    <p className="text-sm font-medium">Loading responses...</p>
                  </div>
                ) : approvedComments.length === 0 ? (
                  <div className="py-16 text-center bg-gray-50/50 rounded-2xl border border-gray-100 border-dashed">
                    <p className="text-gray-500 font-medium tracking-wide">
                      No thoughts shared yet. Start the conversation.
                    </p>
                  </div>
                ) : (
                  approvedComments.map((c) => (
                    <div
                      key={c._id}
                      className="group flex gap-5 p-6 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors"
                    >
                      <img
                        src={c.createdBy?.avatar || assets.user_icon}
                        alt="user"
                        loading="lazy"
                        decoding="async"
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                      />
                      <div className="flex-1 space-y-1.5">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                          <span className="font-bold text-gray-900 tracking-tight">
                            {c.createdBy?.fullName || "Anonymous"}
                          </span>
                          <span className="hidden sm:inline text-gray-300">•</span>
                          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                            {Moment(c.createdAt).fromNow()}
                          </span>
                        </div>
                        <p className="text-gray-600 text-base leading-relaxed">{c.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        ) : (
          <div className="mt-20">
            <div
              onClick={() => navigate("/login")}
              className="group cursor-pointer bg-white rounded-3xl p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all"
            >
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🔒</span>
              </div>
              <h4 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Join the Conversation</h4>
              <p className="text-gray-500 font-medium">
                Log in to interact, share your thoughts, and unlock AI features.
              </p>
            </div>
          </div>
        )}
      </article>
    </div>
  );
};
export default WholeBlog;


