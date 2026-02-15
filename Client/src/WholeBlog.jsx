import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { assets } from './assets/assets';
import { AuthContext } from './Context/Authcontext'
import { useContext } from "react";
import Moment from 'moment'
import API from './Api/api';

import Loader from './Effects/Summarising';
import toast from 'react-hot-toast'
import Button from './Effects/Button';

const WholeBlog = () => {
  const { blogId } = useParams();
  const [content, setContent] = useState('')
  const [originalContent, setOriginalContent] = useState("");
  const [ailoading, setaiLoading] = useState(false);
  const [comment, setComment] = useState("")
  const [DBcomments, setDBcomments] = useState([])
  const [aicontent, setaicontent] = useState(false);
  const Navigate = useNavigate()
  const [blog, setBlog] = useState(null);
  const { isLoggedIn } = useContext(AuthContext)




  const fetchBlogs = async () => {
    try {
      console.log("Entered in fetchBlogs frnted")
      const res = await API.get(`/blog/blogbyid/${blogId}`);

      if (res.data.success) {
        setBlog(res.data.blog);


      }

    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };


  useEffect(() => {
    fetchBlogs();
  }, []);


  useEffect(() => {
    if (blog) {
      setOriginalContent(blog.content)
      setContent(blog.content);
    }
  }, [blog]);



  const AiSummarise = async () => {


    try {
      setaiLoading(true)

      const res = await API.post('/ai/summarise', {
        content: content
      })

      if (res.data.success) {

        setContent(res.data.content)

        setaicontent(true)
      }
      else{
        toast.error(res.data.message);
      }

    } catch (error) {

      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      console.log(message)
      toast.error(message);
    }

    finally {
      setaiLoading(false)

    }
  }

  // Used for addComment
  const handlecomments = async (e) => {
    e.preventDefault();
    try {
      console.log("Entered in handlecomments React")
      const res = await API.post("/comment/addcomment", { content: comment, blogId: blogId })
      if (!res.data.success) {
        toast.error(res.data.message)
        console.log(res.data.message)
      }
      console.log(res.data.message)
      toast.success(res.data.message)
      setComment("");
      fetchComments();

    } catch (error) {
      toast.error(error.response?.data?.message || "Comment failed")
      console.log("This is catch block of handlecomments from React : ", error.message)

    }
  }

  const fetchComments = async () => {
    try {
      const res = await API.get(`/comment/allcomment/${blogId}`);
      if (res.data.success) {
        setDBcomments(res.data.comments);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGoback = () => {
    setContent(originalContent)
    setaicontent(false);
  }

  useEffect(() => {
    fetchComments();
  }, [blogId]);



  useEffect(() => {
    if (ailoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [ailoading]);


  return (
    <>

      <div className='relative'>

        <img
          src={assets.back2}
          alt="background"
          className="fixed inset-0 w-screen h-screen object-cover -z-10"
        />


        {!blog ? (
          <h1 className="text-center mt-20 text-lg text-gray-500">
            Loading blog...
          </h1>
        ) : (
          <>

            <div className="relative overflow-hidden">
              <div className="absolute inset-0  to-slate-100" />
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


            <div className="max-w-full mx-auto px-5 py-12 flex flex-col items-center ">

              <div className="rounded-2xl overflow-hidden shadow-lg mb-10 max-w-5xl">
                <img
                  src={blog.image}
                  alt={blog.title}
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
                <div
                  className="rich-text max-w-4/5 mx-auto"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>


              <div>
              </div>


            </div>
            <div className="flex justify-center items-center mt-8 mb-8">



              {isLoggedIn && !aicontent &&
                <div className="px-6  rounded-xl  text-white font-mediumtransition"
                  onClick={() => AiSummarise()}
                >{ailoading ? "Summarising..." : <Button />}</div>}




              {isLoggedIn && aicontent && (
                <button
                  className="px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
                  onClick={() => handleGoback()}
                >
                  🔙 Go Back
                </button>
              )}



              {!isLoggedIn && (
                <button
                  className="px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
                >
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
                  <form
                    onSubmit={handlecomments}
                    className="bg-white rounded-2xl p-6 shadow-md border"
                  >
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
                        Total comments: <span className="font-medium">{DBcomments.length}</span>
                      </p>

                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
                      >
                        Post Comment
                      </button>
                    </div>
                  </form>
                </div>


                <div className="max-w-3xl mx-auto px-5 mt-10 space-y-4">
                  {DBcomments.filter((c) => c.isApproved).length === 0 ? (
                    <p className="text-center text-gray-500 text-sm">
                      No comments yet. Be the first to share your thoughts ✨
                    </p>
                  ) : (
                    DBcomments
                      .filter((c) => c.isApproved)
                      .map((c) => (
                        <div
                          key={c._id}
                          className="flex gap-4 bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition"
                        >
                          <img
                            src={c.createdBy?.avatar || assets.user_icon}
                            alt="user"
                            className="w-11 h-11 rounded-full border"
                          />

                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-gray-900">
                                {c.createdBy?.fullName || "User"}
                              </p>
                              <span className="text-xs text-gray-400">
                                {Moment(c.createdAt).fromNow()}
                              </span>
                            </div>

                            <p className="text-gray-700 text-sm mt-1 leading-relaxed">
                              {c.content}
                            </p>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </>
            ) : (
              <div className="max-w-3xl mx-auto px-5 mt-14">
                <div
                  onClick={() => Navigate("/login")}
                  className="cursor-pointer bg-gray-50 border rounded-2xl p-6 text-center hover:bg-gray-100 transition"
                >
                  <p className="text-gray-700 text-lg">
                    🔒 <span className="font-semibold">Login</span> to comment and use AI features
                  </p>
                </div>
              </div>
            )}
          </>
        )}



      </div>
    </>

  );

}

export default WholeBlog