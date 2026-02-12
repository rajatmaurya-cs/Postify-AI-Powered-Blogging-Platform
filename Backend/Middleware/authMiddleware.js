
import { validateAccessToken } from '../Service/Authentication.js'
import { redisClient } from '../Config/redis.js';

export const authMiddleware =  async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;


    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const isBlocked = await redisClient.get(`bl_${token}`);

    if (isBlocked) {
      return res.status(401).json({
        message: "Session expired. Please login again.",
      })}


      

      const decoded = validateAccessToken(token); 

      req.user = decoded; 


      console.log("The role of User is : ", req.user.role)
      next();

    } catch (error) {
      console.log("This is catch Block of authMiddleware : ", error)
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };


  export default authMiddleware;