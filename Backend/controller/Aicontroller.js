// import groq from "../config/Gemini.js";
import AILog from '../Models/AIlog.js';
import Config from '../Models/Config.js'
import { redisClient } from "../Config/redis.js";

/*----------------------------------Prompts---------------------------------------------------*/
import {blogPrompt} from './Service/Prompts/Prompt.js'
import {summaryPrompt} from './Service/Prompts/Prompt.js'


import { contentGenerationService } from "./Service/AiEngine/Aiservice.js";

import {articleSummariser} from './Service/AiEngine/Aiservice.js'



export const generateContent = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({ success:false, message:"Login required" });
    }
    

    const {topic} = req.body;

    const prompt = blogPrompt(topic)
    const result = await contentGenerationService({
      user: req.user,
      prompt: prompt
    });

    return res.status(200).json({
      success: true,
      content: result
    });

  } catch (error) {
      console.log(error)
    return res.status(error.status || 500).json({
      success:false,
      message:error.message || "AI generation failed"
    });

  }
};



export const summariseArticle = async (req, res) => {
  try {
      console.log("summariseArticle 1 backend")
    if (!req.user) {
      return res.status(401).json({ success:false, message:"Login required" });
    }
    const {content} = req.body;

    console.log("Entered in summariseArticle backend")

   

    const prompt = summaryPrompt(content)
    
    const result = await articleSummariser({
      user: req.user,
      prompt: prompt
    });

    return res.status(200).json({
      success: true,
      content: result
    });

  } catch (error) {
  console.log("The Error is : ", error);

  return res.status(error.status || 500).json({
    success: false,
    message: error.message || "AI Summariser failed"
  });
}


  }









