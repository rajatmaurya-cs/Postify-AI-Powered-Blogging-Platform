import { redisClient } from '../Config/redis.js'
import bcrypt from "bcrypt";

import { sendOtpEmail } from "../utils/mailer.js";


export const sendOtpService = async (email) => {

    
    const cooldown = await redisClient.get(`otpCooldown:${email}`);

    if (cooldown) {
        throw new Error("Please wait 60 seconds before requesting another OTP");
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

  
    const hashedOTP = await bcrypt.hash(otp, 10);

    
    await redisClient.set(`otp:${email}`, hashedOTP, {
        EX: 300
    });

    
    await redisClient.set(`otpCooldown:${email}`, "true", {
        EX: 60
    });

    await sendOtpEmail(email, otp);
    return true;
};
