import React, { useState, useEffect } from 'react'
import API from '../../Api/api';

import toast from 'react-hot-toast'


const BlogList = () => {
    const [blogs, setBlogs] = useState([]);

    const DBblog = async () => {
        try {
            const res = await API.get("/blog/allblog");

            if (!res.data.success) return;

            setBlogs(res.data.blogs);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        DBblog();
    }, []);

    const handlePublish = async (blogId) => {
        const toastId = toast.loading("Updating blog status...");

        try {
            const res = await API.post("/blog/toggle-blog", { blogId });

            if (!res.data.success) {
                toast.error(res.data.message, { id: toastId });
                return;
            }

            toast.success(res.data.message, { id: toastId });


            await DBblog();

        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update blog status",
                { id: toastId }
            );
        }
    };


    const handleRemove = async (blogId) => {
        try {

            const res = await API.post('/blog/delete-blog', { blogId })
            if (!res.data.success) {
                console.log(res.data.message);
                return;
            }

        } catch (error) {
            console.log(error.message)
        }



    };





    return (
        <div className='mt-10'>
           <div className="bg-white rounded-xl shadow-sm overflow-hidden max-w-4xl ml-10">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b">
          <tr className="text-gray-600 text-sm">
            <th className="p-4">#</th>
            <th className="p-4">BLOG TITLE</th>
            <th className="p-4">DATE</th>
            <th className="p-4">STATUS</th>
            <th className="p-4">ACTIONS</th>
            <th className="p-4">REMOVE</th>
             <th className="p-4">ModratedBy</th>
          </tr>
        </thead>

        <tbody>
          {blogs.map((blog, index) => (
            <tr key={blog._id} className="border-b hover:bg-gray-50">
              <td className="p-4">{index + 1}</td>
              <td className="p-4">{blog.title}</td>
              <td className="p-4">
                {new Date(blog.createdAt).toLocaleDateString()}
              </td>
              <td
                className={`p-4 font-medium ${blog.isPublished
                  ? "text-green-600"
                  : "text-yellow-600"
                  }`}
              >
                {blog.isPublished ? "Published" : "Not Published"}
              </td>

              <td className="p-4">
                <button
                  onClick={() => handlePublish(blog._id)}
                  className="bg-gray-300 hover:bg-gray-700 hover:text-white px-4 py-1 rounded-2xl"
                >
                  {blog.isPublished ? "Unpublish" : "Publish"}
                </button>
              </td>

              <td className="p-4">
                <button
                  onClick={() => handleRemove(blog._id)}
                  className="bg-gray-300 hover:bg-gray-700 px-4 py-1 w-25 rounded-2xl"
                >
                  ❌
                </button>
              </td>

              <td
                className={`p-4 font-medium ${blog.isPublished
                  ? "text-green-600"
                  : "text-yellow-600"
                  }`}
              >
                {blog.moderatedBy?.fullName || "NONE"}
              </td>

              
            </tr>
          ))}
        </tbody>
      </table>
    </div>

        </div>
    )
}

export default BlogList
