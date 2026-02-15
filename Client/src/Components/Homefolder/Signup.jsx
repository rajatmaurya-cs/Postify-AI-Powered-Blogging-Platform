
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import OtpInput from "react-otp-input";
import toast from "react-hot-toast";

import API from "../../Api/api";
import useGoogleAuth from "../../hooks/useGoogleAuth";
import useSendOtp from "../../hooks/useSendOtp";
import useVerifyOtp from "../../hooks/useVerifyOtp";

const Signup = () => {
  const [fullName, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const Navigate = useNavigate();
  const googleLogin = useGoogleAuth();


  const { sendOtp, sending, otpSent, setOtpSent } = useSendOtp("signup");

  const { verifyOtp, isVerifying, isVerified, setIsVerified } = useVerifyOtp("signup");



  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/signup", {
        fullName,
        email,
        password,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Signup successful");
        Navigate("/login");
      } else {
        toast.error(res.data.message || "Signup failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Signup failed");
    }
  };


  useEffect(() => {

    if (otp.length === 6 && !isVerifying && !isVerified) {
      console.log("Verifying OTP...");
      verifyOtp(email, otp);
    }
  }, [otp, isVerifying, isVerified, email, verifyOtp]);



  useEffect(() => {
    if (isVerified) {
      setOtp("");
      setOtpSent(false);
    }
  }, [isVerified, setOtpSent]);




  useEffect(() => {

    const checkEmailVerification = async () => {

      try {

        const savedEmail = sessionStorage.getItem("signupEmail");

        if (!savedEmail) return;

        const res = await API.post('/auth/verifyemail', { email: savedEmail })

        if (res.data.success) {
          setEmail(savedEmail);
          setIsVerified(true);
          toast.success("Email verified Again")
        }

      } catch (error) {
        toast.error(error)
      }
    };

    checkEmailVerification();

  }, []);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8">
        <div className="w-full flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Create your account ✨</h2>
            <p className="text-sm text-gray-500 mt-1">Signup to continue to your AI Blog</p>
          </div>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            {isVerified && (
              <input
                type="text"
                placeholder="👤 Enter your name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={fullName}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
            )}

            <div className="flex gap-3">
              <input
                type="email"
                placeholder="📧 Enter your email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100"
                value={email}
                disabled={isVerified}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {!isVerified && email !== "" && (
                <button
                  className="px-4 py-3 bg-gray-900 hover:bg-black text-white rounded-lg whitespace-nowrap transition disabled:opacity-60"
                  type="button"
                  disabled={sending}
                  onClick={() => sendOtp(email)}
                >
                  {sending ? "Sending..." : "Send OTP"}
                </button>
              )}
            </div>

            {isVerified && (
              <input
                type="password"
                placeholder="🔒 Set password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            )}

            {isVerified && (
              <button
                type="submit"
                className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                Create Account
              </button>
            )}
          </form>

          {otpSent && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 flex flex-col items-center gap-3">
              <p className="text-sm font-medium text-gray-700">
                Enter the 6-digit OTP sent to your email
              </p>

              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                disabled={isVerifying}
                containerStyle={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  width: "100%",
                }}
                inputStyle={{
                  width: "44px",
                  height: "46px",
                  borderRadius: "10px",
                  border: "2px solid #d1d5db",
                  fontSize: "18px",
                  fontWeight: "600",
                  textAlign: "center",
                  background: "white",
                }}
                focusStyle={{
                  outline: "none",
                  border: "2px solid #f59e0b",
                  boxShadow: "0 0 0 3px rgba(245,158,11,0.25)",
                }}
                renderInput={(props) => <input {...props} />}
              />

              <p className="text-xs text-gray-500">
                {isVerifying ? "Verifying OTP..." : "Tip: Check spam if you don’t see it."}
              </p>
            </div>
          )}

          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => Navigate("/login")}
              className="text-amber-500 font-semibold hover:underline cursor-pointer"
            >
              Login
            </span>
          </p>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-sm text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <button
            type="button"
            onClick={googleLogin}
            className="w-full bg-white border border-gray-300 hover:bg-gray-100 
            text-gray-700 font-semibold py-3 rounded-lg transition duration-200 
            flex items-center justify-center gap-3"
          >
            <img src={assets.google} alt="Google" className="w-5 h-5 object-contain" />
            <span>Signup with Google</span>
          </button>

          <p className="text-xs text-center text-gray-500">Powered by AI ✨</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
