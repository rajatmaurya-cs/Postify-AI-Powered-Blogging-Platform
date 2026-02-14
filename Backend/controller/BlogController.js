import Blog from '../Models/Blog.js'
import fs from 'fs'
import imageKit from '../Config/imagekit.js'
// import main from '../Config/Gemini.js';
// import groq from "../config/Gemini.js";
import AILog from '../Models/AIlog.js';

import { convertHtmlToText } from '../utils/htmlToPlainText.js'
import { analyzeContent } from "../utils/contentAnalyzer.js";




export const addBlog = async (req, res) => {
  try {
    

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Login required",
      });
    }

    
    let blogData;
    try {
      blogData = JSON.parse(req.body.blog);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog data format",
      });
    }


    const {
      title,
      subTitle,
      content,
      category,
      isPublished,
      aiAnalysis,
      contentSource, // "ai" | "human"
    } = blogData;






    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Blog image is required",
      });
    }

  
    const fileBuffer = fs.readFileSync(req.file.path);

    const uploadResponse = await imageKit.upload({
      file: fileBuffer,
      fileName: `${Date.now()}-${req.file.originalname}`,
      folder: "/blogs",
    });

    if (!uploadResponse?.url) {
      throw new Error("Image upload failed");
    }

  
    await Blog.create({
      title,
      subTitle,
      content,
      category,
      image: uploadResponse.url,

      isPublished: Boolean(isPublished),

      createdBy: req.user.id,

      contentSource: contentSource || "human",

      aiAnalysis: aiAnalysis || null,
    });

    return res.status(201).json({
      success: true,
      message: "Blog added successfully",
    });
  } catch (error) {
    console.error("AddBlog Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};


export const getallblog = async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .select("-content -aiAnalysis -subTitle")
      .sort({ createdAt: -1 })
      .populate("moderatedBy","fullName");

    if (blogs.length === 0) {
      return res.json({ success: false, message: "No blog exists" });
    }

    return res.json({
      success: true,
      blogs,
    });

  } catch (error) {
    console.error("GET ALL BLOG ERROR ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getblogbyid = async (req, res) => {
  try {
      

    const { blogId } = req.params;



    const blog = await Blog.findById(blogId).populate("createdBy", "fullName email avatar");





    if (!blog) return res.json({ success: false, message: "Blog not found" })
    res.json({
      success: true,
      blog,
    });

  }
  catch (error) {
    res.json({ success: false, message: error.message })

  }
}




export const deleteBlog = async (req, res) => {
  try {

      if(!req.user){
          return res.status(404).json({
            success : false,
            message : "Please Login"
          })
        }
    const { blogId } = req.body;


    const blog = await Blog.findByIdAndDelete(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};




export const toggleblogpublish = async (req, res) => {
  try {

      if(!req.user){
          return res.status(404).json({
            success : false,
            message : "Please Login"
          })
        }


    const { blogId } = req.body;


    const blog = await Blog.findById(blogId);


    if (!blog) {
      return res.json({
        success: false,
        message: "Blog not found with this ID"
      });
    }

    blog.isPublished = !blog.isPublished;
    blog.moderatedBy = req.user.id
    await blog.save();

    res.json({ success: true, message: "Blog updated status successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};





export const GenerateReport = (req, res) => {

    if(!req.user){
          return res.status(404).json({
            success : false,
            message : "Please Login"
          })
        }

   
    
  const { data } = req.body;

  const plaintextcontent = convertHtmlToText(data);

  const analysis = analyzeContent(plaintextcontent)
  console.log(analysis)
  res.json({
    success: true,
    Report: analysis
  })

}



