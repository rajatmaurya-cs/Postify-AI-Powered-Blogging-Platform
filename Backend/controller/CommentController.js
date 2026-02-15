import Comment from '../Models/Comments.js'
import Blog from '../Models/Blog.js';
import { spamFilter } from '../utils/spamFilter.js';
import { aimoderation } from '../Service/aiModerationService.js';
import AILog from '../Models/AIlog.js';
import { redisClient } from "../Config/redis.js";
import Config from "../Models/Config.js";





export const addComment = async (req, res) => {
  try {
    console.log("Entered in addComment Backend");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Please login to post a comment",
      });
    }

    const userId = req.user.id;

    /* ---------------- COMMENT RATE LIMIT ---------------- */
    const key = `CommentAttempts:${userId}`;
    const attempts = await redisClient.incr(key);

    if (attempts === 1) {
      await redisClient.expire(key, 60); // 1 minute window
    }

    if (attempts > 1) {
      return res.status(429).json({
        success: false,
        message: "Too many comments. Please wait a moment.",
      });
    }

    /* ---------------- INPUT VALIDATION ---------------- */
    const { content, blogId } = req.body;

    if (!content || !blogId) {
      return res.status(400).json({
        success: false,
        message: "Content and blogId are required",
      });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    /* ---------------- SPAM / AI MODERATION ---------------- */
    let riskLevel = spamFilter(content);

    if (riskLevel !== "HIGH_RISK") {
      const config = await Config.findOne();

      if (config?.aiEnabled) {
        try {
          const aiRisk = await aimoderation(content);

          const priority = {
            SAFE: 1,
            REVIEW: 2,
            HIGH_RISK: 3,
          };

          if (priority[aiRisk] > priority[riskLevel]) {
            riskLevel = aiRisk;
          }
        } catch (aiError) {
          console.error("AI moderation failed:", aiError);
          riskLevel = "REVIEW";
        }
      } else {
        if (riskLevel === "SAFE") {
          riskLevel = "REVIEW";
        }
      }
    }

    /* ---------------- SAVE COMMENT ---------------- */
    const isApproved = riskLevel === "SAFE";

    const comment = await Comment.create({
      content,
      blogId,
      createdBy: userId,
      riskLevel,
      isApproved,
    });

    return res.status(201).json({
      success: true,
      message: isApproved
        ? "Comment published successfully"
        : "Comment added and sent for moderation",
      riskLevel,
      comment,
    });

  } catch (error) {
    console.error("Add Comment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};





  export const getAllComments = async (req, res) => {
    try {
      const comments = await Comment.find({})
        .populate("createdBy", "fullName email")
        .populate("moderatedBy", "fullName")
        .sort({ createdAt: -1 })



      if (comments.length === 0) {
        return res.status(200).json({
          success: false,
          message: "No comments found",
          comments: []
        });
      }

      res.status(200).json({
        success: true,
        comments
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };





  export const getCommentsByBlogId = async (req, res) => {
    try {
      const { blogId } = req.params;

      const comments = await Comment.find({
        blogId,
        isApproved: true
      })
        .populate("createdBy", "fullName email avatar")
        .sort({ createdAt: -1 });


      if (comments.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No comments yet",
          comments: []
        });
      }

      res.status(200).json({
        success: true,
        message: "Comments fetched successfully",
        comments
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };





  export const toggleComment = async (req, res) => {
    try {

      if (!req.user) {
        return res.status(404).json({
          success: false,
          message: "Please Login to Post Comment"
        })
      }


      const { commentId } = req.body;


      const comment = await Comment.findById(commentId)


      if (!comment) {
        return res.status(404).json({
          success: false,
          message: "Comment not found"
        });
      }


      comment.isApproved = !comment.isApproved;
      comment.moderatedBy = req.user.id
      comment.moderatedAt = Date.now()

      await comment.save();


      res.status(200).json({
        success: true,
        message: "Comment approval status updated",
        isApproved: comment.isApproved
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };





  export const removecomment = async (req, res) => {
    try {

      if (!req.user) {
        return res.status(404).json({
          success: false,
          message: "Please Login to Post Comment"
        })
      }



      const { commentId } = req.body;
      const comment = await Comment.findByIdAndDelete(commentId)

      if (!comment) {
        return res.json({
          success: false,
          message: "Comment not found"
        })
      }

      return res.json({
        success: true,
        message: "Comment deleted successfully"
      })

    } catch (error) {

    }
  }

