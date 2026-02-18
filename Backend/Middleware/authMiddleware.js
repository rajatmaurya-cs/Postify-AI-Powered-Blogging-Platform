import { redisClient } from "../Config/redis.js";
import { validateAccessToken } from "../Utils/token.js"; // adjust path

export const authMiddleware = async (req, res, next) => {
  try {
    
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ message: "No access token" });
    }

    
    const isBlocked = await redisClient.get(`bl_${token}`);
    if (isBlocked) {
      return res.status(401).json({
        message: "Session expired. Please login again.",
      });
    }

    
    const decoded = validateAccessToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    console.log("authMiddleware error:", error?.message || error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
