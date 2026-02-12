import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({

   content: {
      type: String,
      required: true,
      trim: true
   },

   blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
      index: true
   },

   createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
   },

   
   riskLevel: {
      type: String,
      enum: ["SAFE", "REVIEW", "HIGH_RISK"],
      default: "REVIEW",
      index: true
   },

   isApproved: {
      type: Boolean,
      default: false,
      index: true
   },

   
   moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
   },

   moderatedAt: {
      type: Date,
      default: null
   },

  
}, { timestamps: true });


 const Comment = mongoose.model("Comment", commentSchema);

 export default Comment;
