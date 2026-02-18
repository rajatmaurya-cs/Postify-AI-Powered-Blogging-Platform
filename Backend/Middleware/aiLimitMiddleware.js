// import Config from "../Models/Config.js";
// import AIUsage from "../Models/AIUsage.js";
// import AILog from "../Models/AIlog.js";
// import { redisClient } from "../Config/redis.js";

// const checkAiLimit = async (req, res, next) => {
//   try {

//     const config = await Config.findOne();

//     if (!config?.aiEnabled) {
//       console.log("Ai currently disabled")
//       return res.status(403).json({
//         success: false,
//         message: "AI is currently disabled",
//       });
//     }

//     const userId = req.user.id;
//     const role = req.user.role

//     if (role === 'ADMIN') return next();



//     // rate limit
//     const key = `AIAttempts:${userId}`;
//     const attempts = await redisClient.incr(key);

//     if (attempts === 1) {
//       await redisClient.expire(key, 60);
//     }

//     if (attempts > 1) {
//       throw { status: 429, message: "Rate limit exceeded wait a Moment 🙏🏼" };
//     }


//     const startOfDay = new Date();
//     startOfDay.setUTCHours(0, 0, 0, 0);

//     const endOfDay = new Date();
//     endOfDay.setUTCHours(23, 59, 59, 999);

//     const totalRequestsToday = await AILog.countDocuments({
//       createdAt: { $gte: startOfDay, $lte: endOfDay },
//     });

//     if (totalRequestsToday >= config.dailyappLimit) {
//       return res.status(429).json({
//         success: false,
//         message: "Daily AI app limit reached. Try again tomorrow.",
//       });
//     }

//     const userLimit = config.dailyAiLimit;

//     const today = new Date().toISOString().slice(0, 10);





//     let usage = await AIUsage.findOne({ userId, date: today });

//     if (!usage) {
//       usage = await AIUsage.create({
//         userId,
//         role: req.user.role,
//         date: today,
//         count: 0
//       });
//     }

//     if (usage.count >= userLimit) {
//       return res.status(429).json({
//         success: false,
//         message: "Daily AI limit reached"
//       });
//     }

//     usage.count++;
//     await usage.save();

//     next();

//   } catch (error) {
//     console.error("AI Limit Middleware Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message || "AI limit check failed",
//     });
//   }
// };




import AIUsage from "../Models/AIUsage.js";
import { redisClient } from "../Config/redis.js";
import getConfigCached from "../utils/getConfigCached.js";

const checkAiLimit = async (req, res, next) => {
  try {
    const config = await getConfigCached();

    if (!config?.aiEnabled) {
      return res
        .status(403)
        .json({ success: false, message: "AI is currently disabled" });
    }

    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (role === "ADMIN") return next();

    // -------- 1) Per-minute per-user rate limit (Redis) --------
    const perMinute = Number(config.aiPerMinuteLimit ?? 0);
    if (!Number.isFinite(perMinute) || perMinute <= 0) {
      return res
        .status(500)
        .json({ success: false, message: "aiPerMinuteLimit not configured" });
    }

    const rateKey = `AI:rate:${userId}`;
    const rate = await redisClient.incr(rateKey);
    if (rate === 1) await redisClient.expire(rateKey, 60);

    if (rate > perMinute) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Try again in a minute.",
      });
    }

    // -------- 2) App-wide daily limit (Redis) 

    const dailyAppLimit = Number(config.dailyappLimit ?? 0);
    if (!Number.isFinite(dailyAppLimit) || dailyAppLimit <= 0) {
      return res
        .status(500)
        .json({ success: false, message: "dailyappLimit not configured" });
    }

    const now = new Date();
    const dateKey = now.toISOString().slice(0, 10); // "YYYY-MM-DD" (UTC)

    const appDailyKey = `AI:appDaily:${dateKey}`;
    const appCount = await redisClient.incr(appDailyKey);

    if (appCount === 1) {
  
      const nextMidnightUTC = new Date();
      nextMidnightUTC.setUTCHours(24, 0, 0, 0);

      const ttlSeconds = Math.floor((nextMidnightUTC - now) / 1000);
      await redisClient.expire(appDailyKey, ttlSeconds);
    }

    if (appCount > dailyAppLimit) {
      return res.status(429).json({
        success: false,
        message: "Daily AI app limit reached. Try again tomorrow.",
      });
    }

    // -------- 3) Per-user daily limit (Mongo, atomic & safe) 

    const userLimit = Number(config.dailyAiLimit ?? 0);
    if (!Number.isFinite(userLimit) || userLimit <= 0) {
      return res
        .status(500)
        .json({ success: false, message: "dailyAiLimit not configured" });
    }

    let updated;

    try {
   
      updated = await AIUsage.findOneAndUpdate(
        {
          userId,
          date: dateKey,
          $or: [{ count: { $exists: false } }, { count: { $lt: userLimit } }],
        },
        {
          $inc: { count: 1 },
          $setOnInsert: { userId, date: dateKey, role },
        },
        { upsert: true, new: true }
      );
    } catch (err) {
      if (err?.code === 11000) {
      
        updated = await AIUsage.findOneAndUpdate(
          { userId, date: dateKey, count: { $lt: userLimit } },
          { $inc: { count: 1 } },
          { new: true }
        );
      } else {
        throw err;
      }
    }

    if (!updated) {
      return res.status(429).json({
        success: false,
        message: "Daily AI limit reached",
      });
    }

    return next();

  } catch (error) {
    console.error("AI Limit Middleware Error:", error);

    const status = error.status || error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message:
        status >= 500
          ? "AI limit check failed"
          : error.message || "Request blocked",
    });
  }
};

export default checkAiLimit;

