
import groq from "../../../Config/Gemini.js";
import { redisClient } from "../../../Config/redis.js";
import Config from "../../../Models/Config.js";
import AILog from "../../../Models/AIlog.js";




export const contentGenerationService = async ({ user, prompt }) => {

  if (!prompt || prompt.trim() === "") {
    throw { status:400, message:"Prompt is required" };
  }

  const config = await Config.findOne();

  

  if (!config?.aiEnabled) {
    throw { status:403, message:"AI feature disabled" };
  }

 


  const completion = await groq.chat.completions.create({
    model: config.aiModel,
    messages: [
      { role: "system", content: "You are a professional blog writer." },
      { role: "user", content: prompt },
    ],
  });


  await AILog.create({
    userId: user.id,
    role: user.role,
    action: "AI Content Generator",
  });

  return completion.choices[0].message.content;
};






export const articleSummariser = async ({ user, prompt }) => {

  if (!prompt || prompt.trim() === "") {
    throw { status:400, message:"Prompt is required" };
  }

 

  const config = await Config.findOne();

  if (!config?.aiEnabled) {
    throw { status:403, message:"AI feature disabled" };
  }

  
 


  const completion = await groq.chat.completions.create({
    model: config.aiModel,
    messages: [
      { role: "system", content: "You are a professional blog Summariser." },
      { role: "user", content: prompt },
    ],
  });

  await AILog.create({
    userId: user.id,
    role: user.role,
    action: "AI Summariser",
  });
  console.log(completion.choices[0].message.content)
  return completion.choices[0].message.content;
};