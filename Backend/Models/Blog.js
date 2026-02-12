import mongoose from "mongoose";

const { Schema, model } = mongoose;


const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subTitle: { type: String },
    content: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },

    isPublished: {
      type: Boolean,
      default: false
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    moderatedBy : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default : null,
    },

    contentSource: {
      type: String,
      enum: ["ai", "human"],
      required: true,
      default: "human"
    },

    aiAnalysis: {
      words: Number,
      sentences: Number,
      paragraphs: Number,
      avgSentenceLength: String,
      totalScore: Number,
      verdict: String
    }
  },
  { timestamps: true }
);


const Blog = model("Blog", blogSchema);

export default Blog;
