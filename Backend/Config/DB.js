import mongoose from "mongoose";
import initConfig from "../utils/initConfig.js";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 20000,
    });

    isConnected = true;
    console.log("✅ MongoDB connected successfully");

    await initConfig(); // ✅ run AFTER connect, only once
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error; // don’t process.exit in serverless
  }
};

export default connectDB;
