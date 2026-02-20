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
    mutationFn: async (topic) => {
      const res = await API.post("/ai/Generatecontent", { topic });
      if (!res.data?.success) throw new Error(res.data?.message || "AI generation failed");
      return String(res.data.content ?? "");
    },
    onSuccess: (html) => {
      setContent(html.trim());
      setContentType("ai");
      toast.success("AI content generated");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || "AI Generation failed");
    },
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
      toast.error(err?.response?.data?.message || err?.message || "Report failed");
    },
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
      toast.error(err?.response?.data?.message || err?.message || "Upload failed");
    },
  });

  
  const aiLoading = generateContentMutation.isPending;
  const reportLoading = generateReportMutation.isPending;
  const isAdding = addBlogMutation.isPending;

  const handleGenerateContent = () => {
    if (!title.trim()) return toast.error("Please enter a title");
    if (aiLoading) return;
    generateContentMutation.mutate(title.trim());
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
    <form
      onSubmit={handleSubmit}
      className="
        w-full max-w-[1400px] mx-auto mt-10 bg-white shadow-xl rounded-2xl
        border border-gray-200 p-10 space-y-10
      "
    >
      <h1 className="text-3xl font-bold text-gray-800">Create New Blog</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <p className="font-semibold mb-2">Upload Thumbnail</p>

          <label htmlFor="image">
            <img
              src={previewUrl || assets.upload_area}
              className="
                h-28 w-28 object-cover rounded-xl cursor-pointer border
                hover:scale-105 transition
              "
              alt="thumbnail"
            />
            <input
              type="file"
              id="image"
              hidden
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        <div>
          <p className="font-semibold mb-2">Blog Title</p>
          <input
            type="text"
            placeholder="Enter Blog Title..."
            className="
              w-full border border-gray-300 rounded-lg p-3 outline-none
              focus:ring-2 focus:ring-blue-500
            "
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      </div>

      <div>
        <p className="font-semibold mb-2">Sub Title</p>
        <input
          type="text"
          placeholder="Enter subtitle..."
          className="
            w-full border border-gray-300 rounded-lg p-3 outline-none
            focus:ring-2 focus:ring-blue-500
          "
          value={subTitle}
          onChange={(e) => setSubTitle(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Write Blog</h2>

        <div className="relative">
          <div className={`${aiLoading ? "blur-sm pointer-events-none opacity-60" : ""}`}>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_KEY}
              value={content}
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | bold italic | " +
                  "alignleft aligncenter alignright alignjustify | " +
                  "bullist numlist | removeformat | help",
                branding: false,
              }}
              onEditorChange={(newValue) => {
                setContent(newValue);
               
              }}
            />
          </div>

          {aiLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-xl">
              <Suspense
                fallback={
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-700" />
                }
              >
                <Loader2 />
              </Suspense>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleGenerateContent}
          disabled={aiLoading || isAdding}
          className="
            bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg
            font-medium transition disabled:opacity-50
          "
        >
          {aiLoading ? "Generating..." : "Generate with AI"}
        </button>
      </div>

      <div className="flex gap-4">
        {!analysis && (
          <button
            type="button"
            onClick={handleGenerateReport}
            disabled={reportLoading || isAdding}
            className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg transition disabled:opacity-60"
          >
            {reportLoading ? "Generating..." : "Generate Report"}
          </button>
        )}

        {analysis && (
          <button
            type="button"
            onClick={() => setShowReport(true)}
            className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg transition"
          >
            View Report
          </button>
        )}
      </div>

      {showReport && (
        <BlogReport analysis={analysis} type={contentType} onClose={() => setShowReport(false)} />
      )}

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="font-semibold mb-2">Category</p>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="
              w-full border border-gray-300 rounded-lg p-3 outline-none
              focus:ring-2 focus:ring-blue-500
            "
          >
            <option value="">Select Category</option>
            {blogCategories.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="scale-125 cursor-pointer accent-blue-600"
            type="checkbox"
          />
          <p className="font-semibold">Publish Immediately</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isAdding}
        className="
          w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl
          font-semibold text-lg transition disabled:opacity-50
        "
      >
        {isAdding ? "Publishing..." : isPublished ? "Publish Blog" : "Save Draft"}
      </button>
    </form>
  );
};

export default AddBlog;