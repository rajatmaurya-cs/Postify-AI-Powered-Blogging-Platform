import React, { useState } from 'react'

import { assets, blogCategories } from '../../assets/assets'
import API from "../../Api/api";

import toast from 'react-hot-toast'
import Loader2 from '../../Effects/Generating';

import BlogReport from '../../Pop-Up/BlogReport';
import { Editor } from '@tinymce/tinymce-react';

const AddBlog = () => {


  const [isAdding, setIsAdding] = useState(false)
  const [aiLoading, setaiLoading] = useState(false)
  const [reportLoading, setreportLoading] = useState(false)

  const [content, setContent] = useState("");
  const [image, setImage] = useState(false);
  const [title, setTitle] = useState('')
  const [subTitle, SetSubTitle] = useState('')
  const [category, SetCategory] = useState('startup')
  const [isPublished, setIsPublished] = useState(false)
  const [contentType, setContentType] = useState('human')

  const [analysis, setAnalysis] = useState(null)
  const [Report, setReport] = useState(false)





  const AddBlogHandler = async (e) => {
    try {
      e.preventDefault()

      if (!analysis) {
        toast.error("Please generate and review blog report first");
        return;
      }

      setIsAdding(true)

      const blog = {
        title,
        subTitle,
        content: content,
        category,
        isPublished,
        aiAnalysis: analysis,
        contentSource: contentType
      }

      const formData = new FormData();
      formData.append('blog', JSON.stringify(blog))
      formData.append('image', image)

      const res = await API.post(`/blog/addblog`, formData);

      if (res.data.success) {
        toast.success("Blog Added successfully");
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed")
    } finally {
      setIsAdding(false)
    }
  }




  const generatecontent = async () => {

    if (!title) return toast.error('Please enter a title')

    try {
      setaiLoading(true)

      const res = await API.post('/ai/Generatecontent', { topic: title })

      if (res.data.success) {

        const html = res.data.content.trim();

        setContent(html);  

        setContentType("ai")
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "AI Generation failed");
    } finally {
      setaiLoading(false)
    }
  }







  const generateReport = async () => {

    try {
      setreportLoading(true)

      const res = await API.post('/blog/Report', {
        data: content
      })

      if (res.data.success) {
        setAnalysis(res.data.Report)
      }

    } catch (error) {
      console.log(error.message)
    }
    finally {
      setreportLoading(false);
    }
  }

  return (

    <form
      onSubmit={AddBlogHandler}
      className="
    w-full
    max-w-[1400px]
    mx-auto
    mt-10
    bg-white
    shadow-xl
    rounded-2xl
    border
    border-gray-200
    p-10
    space-y-10
  
  "
    >


      
      <h1 className="text-3xl font-bold text-gray-800">
        Create New Blog
      </h1>


     
      <div className="grid md:grid-cols-2 gap-8">

    
        <div>
          <p className="font-semibold mb-2">Upload Thumbnail</p>

          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              className="
                h-28 w-28
                object-cover
                rounded-xl
                cursor-pointer
                border
                hover:scale-105
                transition
              "
              alt=""
            />
            <input
              type="file"
              id="image"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
        </div>

     
        <div>
          <p className="font-semibold mb-2">Blog Title</p>
          <input
            type="text"
            placeholder="Enter Blog Title..."
            className="
              w-full
              border
              border-gray-300
              rounded-lg
              p-3
              outline-none
              focus:ring-2
              focus:ring-blue-500
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
            w-full
            border
            border-gray-300
            rounded-lg
            p-3
            outline-none
            focus:ring-2
            focus:ring-blue-500
          "
          value={subTitle}
          onChange={(e) => SetSubTitle(e.target.value)}
        />
      </div>



      
      <div className="space-y-4">

        <h2 className="text-2xl font-semibold">
          Write Blog
        </h2>

        <div className="relative">



          <div className={`${aiLoading ? "blur-sm pointer-events-none opacity-60" : ""}`}>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_KEY}
              value={content}

              init={{
                height: 500,
                menubar: true,

                plugins: [
                  'advlist', 'autolink', 'lists', 'link',
                  'image', 'charmap', 'preview', 'anchor',
                  'searchreplace', 'visualblocks',
                  'code', 'fullscreen',
                  'insertdatetime', 'media',
                  'table', 'help', 'wordcount'
                ],

                toolbar:
                  'undo redo | blocks | bold italic | ' +
                  'alignleft aligncenter alignright alignjustify | ' +
                  'bullist numlist | removeformat | help',

                branding: false
              }}

              onEditorChange={(newValue) => setContent(newValue)}
            />
          </div>

          {aiLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-xl">
              <Loader2 />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={generatecontent}
          disabled={aiLoading}
          className="
            bg-black
            hover:bg-gray-800
            text-white
            px-6
            py-3
            rounded-lg
            font-medium
            transition
            disabled:opacity-50
          "
        >
          {aiLoading ? "Generating..." : "Generate with AI"}
        </button>

      </div>



   
      <div className="flex gap-4">

        {!analysis && (
          <button
            type='button'
            onClick={generateReport}
            disabled={reportLoading}
            className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg transition"
          >
            {reportLoading ? "Generating..." : "Generate Report"}
          </button>
        )}

        {analysis && (
          <button
            type='button'
            onClick={() => setReport(true)}
            className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg transition"
          >
            View Report
          </button>
        )}

      </div>




      {Report && (
        <BlogReport
          analysis={analysis}
          type={contentType}
          onClose={() => setReport(false)}
        />
      )}



      
      <div className="grid md:grid-cols-2 gap-8 items-center">

        <div>
          <p className="font-semibold mb-2">Category</p>

          <select
            onChange={e => SetCategory(e.target.value)}
            name="category"
            className="
              w-full
              border
              border-gray-300
              rounded-lg
              p-3
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          >
            <option value="">Select Category</option>
            {blogCategories.map((item, index) => (
              <option key={index} value={item}>{item}</option>
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
          w-full
          bg-blue-600
          hover:bg-blue-700
          text-white
          py-4
          rounded-xl
          font-semibold
          text-lg
          transition
          disabled:opacity-50
        "
      >
        {isAdding
          ? "Publishing..."
          : isPublished
            ? "Publish Blog"
            : "Save Draft"}
      </button>

    </form>
  )
}

export default AddBlog
