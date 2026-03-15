import React, { useState, Suspense, lazy, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Editor } from "@tinymce/tinymce-react";

import { assets, blogCategories } from "../../assets/assets";
import API from "../../Api/api";
import BlogReport from "../../Pop-Up/BlogReport";

const Loader2 = lazy(() => import("../../Effects/Generating"));

const AddBlog = () => {
  const queryClient = useQueryClient();

  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("startup");
  const [isPublished, setIsPublished] = useState(false);
  const [contentType, setContentType] = useState("human");

  const [analysis, setAnalysis] = useState(null);
  const [showReport, setShowReport] = useState(false);

  const previewUrl = useMemo(() => {
    return image ? URL.createObjectURL(image) : null;
  }, [image]);


  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);



  const generateContentMutation = useMutation({
    mutationFn: async ({ title, subTitle }) => {

      const res = await API.post("/ai/Generatecontent", { title: title, subTitle: subTitle });
      if (!res.data?.success) throw new Error(res.data?.message || "AI generation failed");
      return String(res.data.content ?? "");
    },
    onSuccess: (html) => {
      setContent(html.trim());
      setContentType("ai");
      toast.success("AI content generated");
    },
    onError: (err) => {
      const message =
        err?.response?.data?.message || err?.message || "Failed to Generate the content";

      toast.error(message, { id: "toggle" });
    }
  });

  const generateReportMutation = useMutation({
    mutationFn: async (htmlContent) => {
      const res = await API.post("/blog/Report", { data: htmlContent });
      if (!res.data?.success) throw new Error(res.data?.message || "Report generation failed");
      return res.data.Report;
    },
    onSuccess: (report) => {
      setAnalysis(report);
      toast.success("Report generated");
    },
    onError: (err) => {
      const message =
        err?.response?.data?.message || err?.message || "Failed Generate the Report";

      toast.error(message, { id: "toggle" });
    }
  });

  const addBlogMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await API.post("/blog/addblog", formData);
      if (!res.data?.success) throw new Error(res.data?.message || "Upload failed");
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Blog added successfully");


      queryClient.invalidateQueries({ queryKey: ["blogs"] });


      setTitle("");
      setSubTitle("");
      setCategory("startup");
      setIsPublished(false);
      setContent("");
      setImage(null);
      setContentType("human");
      setAnalysis(null);
      setShowReport(false);
    },
    onError: (err) => {
      const message =
        err?.response?.data?.message || err?.message || "Failed to upload the Blog";

      toast.error(message, { id: "toggle" });
    }
  });


  const aiLoading = generateContentMutation.isPending;
  const reportLoading = generateReportMutation.isPending;
  const isAdding = addBlogMutation.isPending;

  const handleGenerateContent = () => {
    if (!title.trim()) return toast.error("Please enter a title");
    if (!subTitle.trim()) return toast.error("Subtitle is required");
    if (aiLoading) return;

    generateContentMutation.mutate({
      title: title.trim(),
      subTitle: subTitle.trim(),
    });
  };

  const handleGenerateReport = () => {
    if (!content.trim()) return toast.error("Write content first");
    if (reportLoading) return;
    generateReportMutation.mutate(content);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return toast.error("Title is required");
    if (!subTitle.trim()) return toast.error("Subtitle is required");
    if (!category.trim()) return toast.error("Category is required");
    if (!content.trim()) return toast.error("Content is required");
    if (!image) return toast.error("Thumbnail is required");
    if (!analysis) return toast.error("Please generate and review blog report first");

    const blog = {
      title: title.trim(),
      subTitle: subTitle.trim(),
      content,
      category,
      isPublished,
      aiAnalysis: analysis,
      contentSource: contentType,
    };

    const formData = new FormData();
    formData.append("blog", JSON.stringify(blog));
    formData.append("image", image);

    addBlogMutation.mutate(formData);
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto p-4 sm:p-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">Create Story</h1>
        <p className="text-gray-500 font-medium tracking-wide">Write, format, and publish your next great piece.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-[2.5rem] border border-gray-100 p-8 sm:p-12 space-y-12"
      >

        <div className="grid lg:grid-cols-[1fr_2fr] gap-10">
          {/* Thumbnail Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
              <h3 className="text-lg font-bold text-gray-900">Cover Image</h3>
            </div>
            
            <label htmlFor="image" className="block w-full cursor-pointer group">
              <div className="relative aspect-video w-full rounded-3xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt="thumbnail"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 p-6 text-gray-400 group-hover:text-indigo-500 transition-colors">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-semibold tracking-wide">Upload High-Res Cover</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white font-bold tracking-wide px-6 py-2 rounded-full border border-white/30 bg-white/20">Change Image</span>
                </div>
              </div>
              <input
                type="file"
                id="image"
                hidden
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          {/* Titles & Category Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                <h3 className="text-lg font-bold text-gray-900">Story Details</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2 ml-1">Title</label>
                  <input
                    type="text"
                    placeholder="E.g., The Future of Artificial Intelligence"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 font-bold text-lg placeholder:font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2 ml-1">Subtitle</label>
                  <input
                    type="text"
                    placeholder="A brief summary or hook for the readers"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-700 font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                    value={subTitle}
                    onChange={(e) => setSubTitle(e.target.value)}
                  />
                </div>

                <div>
                   <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2 ml-1">Category</label>
                   <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-700 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                  >
                    <option value="" disabled className="text-gray-400">Select Strategy</option>
                    {blogCategories.map((item, index) => (
                      <option key={index} value={item} className="font-medium text-gray-900 py-2">
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Editor Section */}
        <div className="space-y-4 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
              <h3 className="text-lg font-bold text-gray-900">Content Engine</h3>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleGenerateContent}
                disabled={aiLoading || isAdding}
                className="group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 text-white font-bold tracking-wide rounded-full overflow-hidden transition-all shadow-sm hover:shadow-lg disabled:opacity-50 disabled:hover:shadow-none"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                {aiLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <span>✨ Generate via AI</span>
                  </>
                )}
              </button>

              {!analysis ? (
                <button
                  type="button"
                  onClick={handleGenerateReport}
                  disabled={reportLoading || isAdding || !content}
                  className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold tracking-wide rounded-full shadow-sm hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:bg-gray-50"
                >
                  {reportLoading ? "Analyzing..." : "Review Content"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowReport(true)}
                  className="px-5 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold tracking-wide rounded-full shadow-sm hover:bg-emerald-100 transition-all"
                >
                  View Review Report ✓
                </button>
              )}
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-gray-200 shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 group">
            <div className={`${aiLoading ? "blur-sm pointer-events-none opacity-50" : ""} transition-all duration-300`}>
              <Editor
                apiKey={import.meta.env.VITE_TINYMCE_KEY}
                value={content}
                init={{
                  height: 600,
                  menubar: false,
                  statusbar: false,
                  skin: "oxide",
                  content_style: "body { font-family: 'Inter', sans-serif; font-size: 16px; line-height: 1.6; color: #374151; padding: 1rem; }",
                  plugins: [
                    "advlist", "autolink", "lists", "link", "image", "charmap", 
                    "preview", "anchor", "searchreplace", "visualblocks", "code", "fullscreen", 
                    "insertdatetime", "media", "table", "help", "wordcount"
                  ],
                  toolbar: "undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | removeformat | fullscreen",
                  branding: false,
                }}
                onEditorChange={(newValue) => setContent(newValue)}
              />
            </div>

            {aiLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-10 transition-all duration-300">
                <div className="bg-white p-8 rounded-[2rem] shadow-2xl flex flex-col items-center gap-4 border border-indigo-100 transform scale-100 animate-in zoom-in-95">
                   <Suspense
                    fallback={
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
                    }
                  >
                    <Loader2 />
                  </Suspense>
                  <p className="font-bold text-gray-800 tracking-wide">AI is writing your story...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {showReport && (
          <BlogReport analysis={analysis} type={contentType} onClose={() => setShowReport(false)} />
        )}

        {/* Publishing Actions */}
        <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          
          <label className="flex items-center gap-4 cursor-pointer group bg-gray-50 px-6 py-4 rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors w-full sm:w-auto">
            <div className="relative">
              <input
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="sr-only"
                type="checkbox"
              />
              <div className={`block w-14 h-8 rounded-full transition-colors ${isPublished ? "bg-indigo-600" : "bg-gray-300"}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isPublished ? "transform translate-x-6" : ""}`}></div>
            </div>
            <div>
              <p className="font-bold text-gray-900">Publish Immediately</p>
              <p className="text-xs font-medium text-gray-500">Make visible to all users</p>
            </div>
          </label>

          <button
            type="submit"
            disabled={isAdding}
            className="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white px-8 py-4 rounded-2xl font-bold tracking-wide text-lg shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_25px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {isAdding ? "Saving..." : isPublished ? "Publish Now" : "Save as Draft"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default AddBlog;
