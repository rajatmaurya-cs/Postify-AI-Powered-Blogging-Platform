
import Config from "../Models/Config.js";
import { redisClient } from "../Config/redis.js";

const KEY = "app:config:v1";
const TTL = 300; // 5 minutes

export default  async function getConfigCached() {

  try {
    const cached = await redisClient.get(KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.error("Redis get config failed:", e?.message || e);
  }

  
  const config = await Config.findOne().lean();

  if (!config) {
  
    throw new Error("Config not found in database");
  }

 
  try {
    await redisClient.set(KEY, JSON.stringify(config), { EX: TTL });
  } catch (e) {
    console.error("Redis set config failed:", e?.message || e);
  }


  return config;
}
