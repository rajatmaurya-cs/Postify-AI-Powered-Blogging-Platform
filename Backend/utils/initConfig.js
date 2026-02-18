import Config from "../Models/Config.js";

const initConfig = async (req, res, next) => {
  try {
    const existing = await Config.findOne();

    if (!existing) {
      await Config.create({});
      console.log("✅ Config created for the first time");
    }

    next();
  } catch (err) {
    console.error("❌ Failed to init config:", err);
    next(err);
  }
};

export default initConfig;
