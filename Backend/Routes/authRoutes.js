import express from "express";
import {

  /*====signup & Login =====*/
  login,
  signup,
  googleLogin,


  /*===== Logout & refreshAccessToken =====*/
  logout,
  refreshAccessToken,


  /*===== Logout OTP refreshAccessToken =====*/
  sendOtp,
  verifyOtp,


  /*===== Emails =====*/
  verifyEmails,


  /*===== Reset Password =====*/
  resetpassword,
  checkmailforreset

} from "../controller/auth.controller.js"

import checkAiLimit from "../Middleware/aiLimitMiddleware.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const authRouter = express.Router();







/* --------------------------- Signup & Login --------------------------- */


authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/google", googleLogin);





/* --------------------------- Logout and Refresh Token --------------------------- */

authRouter.post("/logout", authMiddleware, logout);
authRouter.post("/refreshtoken", refreshAccessToken);





/* --------------------------- OTP --------------------------- */

authRouter.post("/sendotp",  sendOtp);
authRouter.post("/verifyotp", verifyOtp);




/* --------------------------- EMAIL --------------------------- */

authRouter.post("/verifyemail", verifyEmails);




/* --------------------------- PASSWORD RESET --------------------- */

authRouter.post("/check-email-reset", checkmailforreset);
authRouter.post("/reset-password", resetpassword);

export default authRouter;
