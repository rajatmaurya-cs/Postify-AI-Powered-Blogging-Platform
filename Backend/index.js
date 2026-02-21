import cookieParser from "cookie-parser";
import express from "express";
import "dotenv/config";
import cors from "cors";

import { connectRedis } from "./Config/redis.js";
import connectDB from "./Config/DB.js";

import authRoutes from "./Routes/authRoutes.js";
import authMiddleware from "./Middleware/authMiddleware.js";

import blogRouter from "./Routes/blogRoutes.js";
import commentRouter from "./Routes/commentRoutes.js";
import AiRouter from "./Routes/AIRoutes.js";

import configRoutes from "./Routes/configRoutes.js";
import adminMiddleware from "./Middleware/adminMiddleware.js";


const app = express();



/* ================= Backend Checking Route ================= */
app.set("trust proxy", 1);
console.log("This is index.js")
app.get("/api/health", (req, res) => res.json({ ok: true }));




/* ================= INIT (DB/Redis) ================= */
let isDbConnected = false;

async function init() {
  if (!isDbConnected) {
    await connectDB();
    connectRedis();
    isDbConnected = true;
  }
}
init();




/* ================= MIDDLEWARE ================= */
console.log("Frontend URL:", process.env.FRONTEND_URL);

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));




app.use(express.json());
app.use(cookieParser());

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);

app.use("/api/blog", blogRouter);
app.use("/api/comment", commentRouter);

app.use("/api/ai", authMiddleware, AiRouter);

app.use("/api/ai/config", authMiddleware, adminMiddleware, configRoutes);

/* ================= 404 ================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ================= GLOBAL ERROR ================= */
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});



export default app;
