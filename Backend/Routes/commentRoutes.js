import express from 'express'
import {addComment , getAllComments , getCommentsByBlogId , toggleComment , removecomment} from '../controller/CommentController.js'
import {authMiddleware} from '../Middleware/authMiddleware.js';
import adminMiddleware from '../Middleware/adminMiddleware.js';

const commentRouter = express.Router();

/* ================= Add Comment ================= */
commentRouter.post('/addcomment' ,authMiddleware, addComment)


/* ================= Get CommentById ================= */
commentRouter.get('/allcomment/:blogId', getCommentsByBlogId)


/* ================= Get AllComments ================= */
commentRouter.get('/comments' , getAllComments)


/* ================= toggleComments ================= */
commentRouter.post('/toggle-comment' , authMiddleware , adminMiddleware , toggleComment )


/* ================= removeComment ================= */
commentRouter.post('/removecomment' , authMiddleware , adminMiddleware , removecomment)


export default commentRouter;
