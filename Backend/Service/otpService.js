import { redisClient } from '../Config/redis.js'
import bcrypt from "bcrypt";

import { sendOtpEmail } from "../utils/mailer.js";


// export const sendOtpService = async (email) => {

    
//     const cooldown = await redisClient.get(`otpCooldown:${email}`);

//     if (cooldown) {
//         throw new Error("Please wait 60 seconds before requesting another OTP");
//     }
    
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

  
//     const hashedOTP = await bcrypt.hash(otp, 10);

    
//     await redisClient.set(`otp:${email}`, hashedOTP, {
//         EX: 300
//     });

    
//     await redisClient.set(`otpCooldown:${email}`, "true", {
//         EX: 60
//     });

//     await sendOtpEmail(email, otp);
//     return true;
// };


export const sendOtpService = async (email, purpose) => {
  if (!purpose) {
    throw new Error("OTP purpose is required");
  }

  const otpKey = `otp:${purpose}:${email}`;
  const cooldownKey = `otpCooldown:${purpose}:${email}`;

  // ⏳ Check cooldown
  const cooldown = await redisClient.get(cooldownKey);
  if (cooldown) {
    throw new Error("Please wait 60 seconds before requesting another OTP");
  }

  // 🔢 Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // 🔐 Hash OTP
  const hashedOTP = await bcrypt.hash(otp, 10);

  // 🗄️ Store OTP for 5 minutes
  await redisClient.set(otpKey, hashedOTP, {
    EX: 300, // 5 minutes
  });

  // 🛑 Set cooldown for 60 seconds
  await redisClient.set(cooldownKey, "true", {
    EX: 60, // 60 seconds
  });

  // 📧 Send email
  await sendOtpEmail(email, otp);

  return true;
};
