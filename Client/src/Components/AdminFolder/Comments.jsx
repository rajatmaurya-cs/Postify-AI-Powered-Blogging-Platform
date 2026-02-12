import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import API from '../../Api/api'
import toast from 'react-hot-toast'


const Comments = () => {
  const [allComments, setAllComments] = useState([]);
  const [comments, setComments] = useState([]);


  const fetchComments = async () => {
    try {

      console.log("fetchComments")
      const res = await API.get('/comment/comments');

      if (res.data.success) {
        setAllComments(res.data.comments)
        setComments(res.data.comments)
      }
    }
    catch (error) {
      console.log(error.message)
    }

  }
  const handleApproval = async (commentId) => {
    try {
      const res = await API.post('/comment/toggle-comment', { commentId })
      if (res.data.success) {
        fetchComments();
      }
      else {
        console.log(res.data.message)
      }


    }
    catch (error) {
      console.log(error.message)
    }



  }

  useEffect(() => {

    fetchComments()

  }, [])

  const approvedcomments = () => {
    console.log("Entered in approvedComments section")
    const approvedComments = allComments.filter(
      comment => comment.isApproved
    );

    setComments(approvedComments);
  }

  const notapprovedcomments = () => {
    const notapprovedcomments = allComments.filter(
      comment => !comment.isApproved
    );
    setComments(notapprovedcomments)
  }


  const handleRemove = async (commentId) => {
    try {
      const res = await API.post('/comment/removecomment', { commentId: commentId })
      if (res.data.success) {
        toast.success(res.data.message);
        console.log("Comment removed succesfully")
        fetchComments();
      }
     if(!res.data.success){
      toast.error(res.data.message)
     }

    } catch (error) {
      toast.error(error);
      console.log(error)
    }
  }




  return (
    







    
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50'>

  
  <div className="flex items-center justify-between max-w-4xl mx-auto px-6 py-3 rounded-lg">
    <h1 className="text-xl font-bold">Comments</h1>

    <div className="flex gap-3">
      <button
        onClick={() => approvedcomments()}
        className="px-4 py-1 rounded-full bg-green-500 hover:bg-green-600 text-white transition"
      >
        Approved
      </button>

      <button
        onClick={() => notapprovedcomments()}
        className="px-4 py-1 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white transition"
      >
        Not Approved
      </button>
    </div>
  </div>


  
  <div className="bg-white rounded-xl shadow-sm overflow-hidden max-w-7xl  mt-6">

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
  {comments.length === 0 ? (
    <tr>
      <td colSpan="8" className="text-center py-10 text-gray-400 font-medium">
        No Comments Found
      </td>
    </tr>
  ) : (
    comments.map((comment, index) => (
      <tr
        key={comment._id}
        className="border-b hover:bg-gray-50 transition"
      >
      
        <td className="p-4 text-gray-600">
          {index + 1}
        </td>

       
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
          {new Date(comment.createdAt).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "numeric"
          })}
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
            onClick={() => handleApproval(comment._id)}
            className="bg-gray-200 hover:bg-gray-800 hover:text-white transition px-4 py-1 rounded-full text-sm"
          >
            {comment.isApproved ? "Unpublish" : "Publish"}
          </button>
        </td>

        
        <td className="p-4 text-center">
          <button
            onClick={() => handleRemove(comment._id)}
            className="bg-red-100 hover:bg-red-600 hover:text-white transition px-3 py-1 rounded-full"
          >
            ❌
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

  )
}

export default Comments
