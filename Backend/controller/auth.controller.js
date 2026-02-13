import jwt from "jsonwebtoken";



import axios from "axios";

import { sendOtpService } from '../Service/otpService.js';

import bcrypt from "bcrypt"



import { oauth2client } from "../utils/googleconfig.js";

import { createAccessToken, createRefreshToken } from '../Service/Authentication.js'

import hashToken from "../utils/hashToken.js";

import { redisClient } from "../Config/redis.js";


/*------------------------------------- Model Import ----------------------------------- */
import User from "../Models/User.js";
import VerifiedEmail from "../Models/VerifiedEmail.js";
import RefreshToken from "../Models/RefreshToken.js";








/*-----------------------User Login / Signup / google-Login  -------------------------------- */

export const signup = async (req, res) => {
  try {
    let { fullName, email, password } = req.body;

    fullName = fullName.trim();
    email = email.toLowerCase().trim();

    if (!fullName || !email || !password) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }


    const existingUser = await User.findOne({ email });

    if (existingUser) {

      if (existingUser.authProvider === "GOOGLE") {
        return res.json({
          success: false,
          message: "Account exists with Google login. Please sign in with Google.",
        });
      }

      return res.json({
        success: false,
        message: "User already exists",
      });
    }


    await User.create({
      fullName,
      email,
      password,
      authProvider: "LOCAL",
    });

    return res.json({
      success: true,
      message: "User signed up successfully",
    });

  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};



export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase().trim();


    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "Email and password are required",
      });
    }


    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }


    const isPasswordMatch = bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }


    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);



    await RefreshToken.deleteMany({ userId: user._id });
    await RefreshToken.create({
      userId: user._id,
      token: hashToken(refreshToken),
    });




    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });



    return res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt,
      },
    });


  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};




export const googleLogin = async (req, res) => {
  try {


    const { code } = req.body;

    if (!code) {
      return res.json({ success: false, message: "Google auth code missing" });
    }


    const { tokens } = await oauth2client.getToken(code);
    oauth2client.setCredentials(tokens);



    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );



    const {
      id: googleId,

      email,
      name: fullName,
      picture,
    } = userRes.data;







    let user = await User.findOne({
      $or: [{ googleId }, { email }],
    });


    if (!user) {
      user = await User.create({
        fullName,
        email,
        googleId,
        authProvider: "GOOGLE",
        avatar: picture
      });
    }


    if (user && !user.googleId) {
      user.googleId = googleId;
      if (!user.authProvider.includes("GOOGLE")) {
        user.authProvider.push("GOOGLE");
      }
      if (user && !user.avatar) user.avatar = picture
      await user.save();
    }


    const token = createTokenForUser(user);


    res.cookie("Token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });


    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt,
      },
    });


  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};









/*--------------------------- Logout & refreshAccessToken---------------------------------- */

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const accessToken = req.headers.authorization?.split(" ")[1];


    if (refreshToken) {
      const hashedToken = hashToken(refreshToken);

      await RefreshToken.deleteOne({
        token: hashedToken,
      });
    }


    if (accessToken) {
      const decoded = jwt.decode(accessToken);

      const expiresIn =
        decoded.exp - Math.floor(Date.now() / 1000);

      if (expiresIn > 0) {
        await redisClient.set(
          `bl_${accessToken}`,
          "blocked",
          { EX: expiresIn }
        );
      }
    }


    res.clearCookie("refreshToken");

    return res.status(200).json({
      message: "Logged out successfully",
    });

  } catch (err) {
    return res.status(500).json({
      message: "Logout failed",
    });
  }
};




export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;



    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }


    const hashedToken = hashToken(refreshToken);

    const storedToken = await RefreshToken.findOne({
      token: hashedToken,
    });

    if (!storedToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    const newAccessToken = createAccessToken(user);

    const newrefreshToken = createRefreshToken(user);


    await RefreshToken.deleteMany({ userId: user._id });
    await RefreshToken.create({
      userId: user._id,
      token: hashToken(newrefreshToken),
    });

    res.cookie("refreshToken", newrefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });



    return res.status(200).json({
      accessToken: newAccessToken,
      user,
    });

  } catch (error) {
    return res.status(403).json({
      message: "Expired or invalid refresh token",
    });
  }
};




/*------------------------------------------ OTP-----------------------------------------*/


export const sendOtp = async (req, res) => {
  try {

    const { email } = req.body;

    await sendOtpService(email);

    return res.json({
      success: true,
      message: "OTP sent successfully"
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


export const verifyOtp = async (req, res) => {
  try {

    let { email, otp } = req.body;
    email = email.toLowerCase().trim();


    const storedOtp = await redisClient.get(`otp:${email}`);

    if (!storedOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found",
      });
    }


    const attempts = await redisClient.incr(`otpAttempts:${email}`);

    if (attempts === 1) {
      await redisClient.expire(`otpAttempts:${email}`, 300);

    }

    if (attempts > 5) {
      return res.status(429).json({
        success: false,
        message: "Too many wrong attempts. Try again later.",
      });
    }


    const isMatch = await bcrypt.compare(
      otp.toString(),
      storedOtp
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }


    await redisClient.del(`otp:${email}`);
    await redisClient.del(`otpAttempts:${email}`);


    await VerifiedEmail.updateOne(
      { email },
      { $set: { email } },
      { upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (error) {

    console.log("verifyOtp error:", error);

    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
};





/*---------------------------------------verifyemails------------------------------------- */
export const verifyEmails = async (req, res) => {
  try {

    let { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    email = email.toLowerCase().trim();

    const record = await VerifiedEmail.findOne({ email });

    return res.status(200).json({
      success: !!record,
      verified: !!record,
      message: record
        ? "Email is verified"
        : "Email is not verified",
    });

  } catch (error) {
    console.log("verifyemails error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
} // VerifyEmails





/*-------------------------------- Password Reset------------------------------------------- */

export const resetpassword = async (req, res) => {
  try {

    let { email, newpassword } = req.body;

    console.log("Entered in resetpassword backend:", email, newpassword)

    email = email.toLowerCase().trim();



    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid Email",
      });
    }




    user.password = newpassword;


    await user.save();

    return res.json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



export const checkmailforreset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User Does not exits"
      })
    }

    await sendOtpService(email)

    return res.json({
      success: true,
      message: "OTP Sent successfully"
    })


  } catch (error) {

    console.log("OTP ERROR:", error.message);

    return res.status(429).json({
      success: false,
      message: error.message,
    })
  }
}
