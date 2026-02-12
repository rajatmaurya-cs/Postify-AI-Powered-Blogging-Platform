import express from "express"
import upload from '../Middleware/Multer.js'
import authMiddleware from "../Middleware/authMiddleware.js"
import adminMiddleware from "../Middleware/adminMiddleware.js"

import  {addBlog , getallblog ,getblogbyid , deleteBlog , toggleblogpublish , GenerateReport} from '../controller/BlogController.js'
import {getDashboardStats} from '../controller/Dashboard.js'
const blogRouter = express.Router();


/* ================= Add Blog ================= */
blogRouter.post('/addblog',upload.single('image') , authMiddleware, adminMiddleware,addBlog)

/* ================= GetAllBlogs ================= */
blogRouter.get('/allblog',getallblog) 


/* ================= getBlogById=================  */
blogRouter.get('/blogbyid/:blogId',getblogbyid)


/* ================= toggleBlog================= */
blogRouter.post("/toggle-blog",authMiddleware ,adminMiddleware, toggleblogpublish)


/* ================= Delete Blog ================= */
blogRouter.post('/delete-blog' , authMiddleware ,adminMiddleware ,deleteBlog)


/* ================= Blog Report ================= */
blogRouter.post('/Report', authMiddleware ,adminMiddleware, GenerateReport)


/* ================= Blog Dashboard =================  */

blogRouter.get('/BlogDashBoard', authMiddleware,adminMiddleware ,getDashboardStats)




export default blogRouter;