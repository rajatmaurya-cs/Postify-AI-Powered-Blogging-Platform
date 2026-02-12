import express from 'express'

import {generateContent , summariseArticle} from '../controller/Aicontroller.js'
import {Aidashboard} from '../controller/Dashboard.js'

import checkAiLimit  from '../Middleware/aiLimitMiddleware.js'
import authMiddleware from '../Middleware/authMiddleware.js'

const AiRouter = express.Router();

/* ================= GenerateContent for Blog ================= */
AiRouter.post('/Generatecontent',checkAiLimit , generateContent)


/* ================= Ai Summariser For Users ================= */
AiRouter.post('/summarise', checkAiLimit ,summariseArticle)


/* ================= NoOfTodayreq , Totalreq , NoOfUniqueUsers ================= */
AiRouter.get('/ai-dashboard',Aidashboard)







export default AiRouter ;