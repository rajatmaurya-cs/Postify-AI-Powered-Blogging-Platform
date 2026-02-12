import express from "express";

import {getConfig , updateConfig , getConfigHistory}    from '../controller/configController.js'

import adminMiddleware from "../Middleware/adminMiddleware.js"



const configRouter = express.Router();

/* ================= AiEnable / UserLimit / AppLimit ================= */
configRouter.get("/config-dashboard", adminMiddleware,getConfig);


/* ================= Change Made by User._id ================= */
configRouter.get('/getConfigHistory',getConfigHistory)


/* ================= updatConfig ================= */
configRouter.put("/updateConfig", adminMiddleware,updateConfig);

export default configRouter;
