// import mongoose from "mongoose";

// const commentSchema = new mongoose.Schema({

//    content: {
//       type: String,
//       required: true,
//       trim: true
//    },

//    blogId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Blog",
//       required: true,
//       index: true
//    },

//    createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       index: true
//    },

   
//    riskLevel: {
//       type: String,
//       enum: ["SAFE", "REVIEW", "HIGH_RISK"],
//       default: "REVIEW",
//       index: true
//    },

//    isApproved: {
//       type: Boolean,
//       default: false,
//       index: true
//    },

   
//    moderatedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null
//    },

//    moderatedAt: {
//       type: Date,
//       default: null
//    },

  
// }, { timestamps: true });


//  const Comment = mongoose.model("Comment", commentSchema);

//  export default Comment;





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
    required: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  riskLevel: {
    type: String,
    enum: ["SAFE", "REVIEW", "HIGH_RISK"],
    default: "REVIEW"
  },

  isApproved: {
    type: Boolean,
    default: false
  },

  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  moderatedAt: {
    type: Date,
    default: null
  }

}, { timestamps: true });

// Compound index for: "get approved comments for a blog, newest first"
commentSchema.index({
  blogId: 1,
  isApproved: 1,
  createdAt: -1
});

// This line was missing
const Comment = mongoose.model("Comment", commentSchema);

export default Comment;