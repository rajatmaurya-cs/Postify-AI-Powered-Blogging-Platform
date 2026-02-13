import React from 'react'
import { useRef, useState, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";
import { assets, blog_data, blogCategories } from '../../assets/assets'
import API from "../../Api/api";
import { parse } from 'marked'
import toast from 'react-hot-toast'
import Loader2 from '../../Effects/Generating';
import Quill from 'quill'
import BlogReport from '../../Pop-Up/BlogReport';


const AddBlog = () => {

  const quillRef = useRef(null)
  const editorRef = useRef(null);
  const [isAdding, setIsAdding] = useState(false)
   const [aiLoading, setaiLoading] = useState(false)
   const [reportLoading , setreportLoading] = useState(false)
  // const [content, setContent] = useState("");
  const [image, setImage] = useState(false);
  const [title, setTitle] = useState('')
  const [subTitle, SetSubTitle] = useState('')
  const [category, SetCategory] = useState('startup')
  const [isPublished, setIsPublished] = useState(false)
  const [contentType , setContentType] = useState('human')

  const [analysis,setAnalysis] = useState(null)
  const [Report , setReport] = useState(false)




  const AddBlog = async (e) => {
    try {
         e.preventDefault()
       if (!analysis) {
    toast.error("Please generate and review blog report first");
    return;
  }
   
      console.log("🔥 AddBlog function triggered");
      setIsAdding(true)
      const blog = {
        title,
        subTitle,
        content: quillRef.current.root.innerHTML,
        category,
        isPublished,
         aiAnalysis:analysis,
         contentSource : contentType
      }
      const formData = new FormData();
      formData.append('blog', JSON.stringify(blog))
      formData.append('image', image)
      console.log("just before res await api")
      const res = await API.post(`/blog/addblog`, formData);
      console.log("after await api")
      console.log("FULL RESPONSE DATA 👉", res.data);

      if (res.data.success) {
        toast.success("Blog Added successful");
      }


    } catch (error) {
     toast.error(error.response?.data?.message || "Comment failed")

    } finally {
      setIsAdding(false)
    }


  }

  const generatecontent = async () => {
    if (!title) return toast.error('please enter a title')

    try {
      console.log("entered in fornted content genrator")
      setaiLoading(true)

      const res = await API.post('/ai/Generatecontent' ,{topic : title})


      if (res.data.success) {
        quillRef.current.root.innerHTML = parse(res.data.content)
      } else {
        toast.error(res.data.message)
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Update failed"
      );
    } finally {
      setaiLoading(false)
      setContentType("ai")
    }
  }


  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' })
    }
  }, [])

  

  const generateReport = async ()=>{
    try{
      setreportLoading(true)
      console.log("entered in generatereport fronted")
      const res =  await API.post('/blog/Report',{
        data : quillRef.current.root.innerHTML
      })
      if(res.data.success){
        setAnalysis(res.data.Report)
        
      }


    }catch(error){
      console.log(error.message)
    }
    finally {
    setreportLoading(false);
  }
  }

  useEffect ( ()=>{
    if(analysis){
      console.log(analysis);
      setreportLoading(false)
    }
  },[analysis])






  return (


    <form
      className="
    mt-4 sm:mt-10
    mx-4 sm:mx-auto
    bg-blue-50/50 text-gray-600
    rounded-xl
    w-full max-w-4xl
    h-[calc(100vh-90px)]
    overflow-y-auto
    p-4 sm:p-8
  "
      onSubmit={(e) => AddBlog(e)}
    >
      
      <div className="space-y-8 max-w-3xl mx-auto">

        <div>
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              className="mt-2 h-16 rounded cursor-pointer"
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
          <p>Title</p>
          <input
            type="text"
            placeholder="Enter Title"
            className="border border-gray-600 bg-white w-full sm:w-2/3 rounded p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <p>Sub Title</p>
          <input
            type="text"
            placeholder="Enter Title"
            className="border border-gray-600 bg-white w-full sm:w-2/3 rounded p-2"
            value={subTitle}
            onChange={(e) => SetSubTitle(e.target.value)}
          />
        </div>
      </div>

  
      <div className="max-w-3xl mx-auto mt-10 space-y-5">
        <h2 className="text-xl font-semibold">Write Blog</h2>

       
        <div className="relative">
        
          <div
            className={`transition-all ${aiLoading ? "blur-[1px] pointer-events-none opacity-60" : ""
              }`}
          >
            <div onClick={()=>setAnalysis(false)}
            ref={editorRef}></div>

          </div>

       
          {aiLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 rounded-xl">
              <Loader2 />
            </div>
          )}
        </div>

     
        <button
          type="button"
          onClick={generatecontent}
          disabled={aiLoading}
          className="bg-gray-900 rounded-xl px-6 py-3 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {aiLoading ? "Generating..." : "Generate with AI"}
        </button>
      </div>




         
            <div className='mt-5'>

            {!analysis ? (  
              <button type='button'
              onClick={()=>generateReport()}
              disabled = {reportLoading}
              className="bg-gray-900 rounded-xl px-6 py-3 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >{reportLoading ? "Generatign":"Generate Report"}</button>) : ""}
         


             {analysis ? (<button type='button'
             onClick={()=>setReport(true)}
              className="bg-gray-900 rounded-xl px-6 py-3 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >View Report</button>) : "" } 

            </div>
             {Report && (
          <BlogReport
            analysis={analysis}
            type = {contentType}
            onClose={() => setReport(false)}
          />
        )}




     
      <div className="max-w-3xl mx-auto mt-10 space-y-6">

        <div>
          <p>Blog Category</p>
          <select
            onChange={e => SetCategory(e.target.value)}
            name="category"
            className="mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded w-full sm:w-1/2"
          >
            <option value="">Select Category</option>
            {blogCategories.map((item, index) => (
              <option key={index} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <input
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="scale-125 cursor-pointer accent-blue-600"
            type="checkbox"
          />
          <p>Publish Now</p>
        </div>


        {isPublished ?( <button
          type="submit"
          disabled={isAdding}
          className="bg-gray-600 rounded-xl p-3 text-white w-full sm:w-auto"
        >
          {isAdding ? "Adding..." : "AddBlog"}
        </button>):
        ( <button
          type="submit"
          disabled={isAdding}
          className="bg-gray-600 rounded-xl p-3 text-white w-full sm:w-auto"
        >
          {isAdding ? "Adding..." : "Make Draft"}
        </button>)}
       
      </div>
    </form>

   


  )
}

export default AddBlog





// 🔍 Why we use URL.createObjectURL(image)
// 👉 Because the browser cannot directly display a file object in an <img> tag.
// URL.createObjectURL(image):
// Turns a File object into a temporary URL
// That URL can be used in <img src="">
// Allows instant preview before upload, { useEffect, useRef, useState }, { Quill }import React from 'react';
