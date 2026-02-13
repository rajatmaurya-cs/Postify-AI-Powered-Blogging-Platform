



import cookieParser from "cookie-parser";
import express from "express";
import "dotenv/config";
import cors from "cors";

import { getDashboardStats, Aidashboard } from './controller/Dashboard.js'

import { connectRedis } from './Config/redis.js'
import authRoutes from "./Routes/authRoutes.js";


import connectDB from "./Config/DB.js";

const app = express();

// DB
await connectDB();
connectRedis();


// Middleware
app.use(
  cors({
     origin: process.env.CLIENT_URL,
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());





/* ================= PUBLIC / AUTH ================= */

import authRouter from './Routes/authRoutes.js'

app.use("/api/auth", authRoutes);


/*
Why FIRST?

Because login/signup must be reachable
WITHOUT authMiddleware blocking them.
*/


/* ================= PROTECTED ROUTES ================= */

import authMiddleware from "./Middleware/authMiddleware.js";

import blogRouter from "./Routes/blogRoutes.js";
import commentRouter from './Routes/commentRoutes.js'
import AiRouter from './Routes/AIRoutes.js'

app.use("/api/blog", blogRouter);
app.use("/api/comment", commentRouter);
app.use("/api/ai", authMiddleware, AiRouter);



/* ================= ADMIN / SENSITIVE ================= */

import configRoutes from "./Routes/configRoutes.js";
import adminMiddleware from "./Middleware/adminMiddleware.js";

app.use(
  "/api/ai/config",
  authMiddleware,
  adminMiddleware,
  configRoutes
);


/* ================= 404 ================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

/* ================= GLOBAL ERROR ================= */

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error"
  });
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


