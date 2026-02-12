// 

import Config from "../Models/Config.js";
import AIUsage from "../Models/AIUsage.js";
import AILog from "../Models/AIlog.js";

const checkAiLimit = async (req, res, next) => {
  try {
      console.log(req.user.role)
      if(req.user.role === 'ADMIN') return next();
      console.log("Entered in checkAiLimit")

   
    const config = await Config.findOne();

    if (!config?.aiEnabled) {
        console.log("Ai currently disabled")
      return res.status(403).json({
        success: false,
        message: "AI is currently disabled",
      });
    }

    const userId = req.user.id;
    const role = req.user.role;

   
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999);

    const totalRequestsToday = await AILog.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    if (totalRequestsToday >= config.dailyappLimit) {
      return res.status(429).json({
        success: false,
        message: "Daily AI app limit reached. Try again tomorrow.",
      });
    }

    


    const userLimit =  config.dailyAiLimit;

    const today = new Date().toISOString().slice(0, 10);

    


    const Userusage = await AIUsage.findOneAndUpdate(
      {
        userId,
        date: today,
        count: { $lt: userLimit },
      },
      {
        $setOnInsert: { role },
        $inc: { count: 1 },
      },
      {
        new: true,
        upsert: true,
      }
    );

    
    if (!Userusage) {
      return res.status(429).json({
        success: false,
        message: "Your daily AI limit has been reached.",
      });
    }
    console.log("Getout from checkAiLimit")
    next();

  } catch (error) {
    console.error("AI Limit Middleware Error:", error);

    return res.status(500).json({
      success: false,
      message: "AI limit check failed",
    });
  }
};







export default checkAiLimit;
