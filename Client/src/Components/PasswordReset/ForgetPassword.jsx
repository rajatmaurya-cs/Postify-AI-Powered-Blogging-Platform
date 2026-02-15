import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import toast from "react-hot-toast";

import API from "../../Api/api";
import useSendOtp from "../../hooks/useSendOtp";
import useVerifyOtp from "../../hooks/useVerifyOtp";

const ForgetPassword = () => {
  const Navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [otp, setOtp] = useState("");

  // ✅ OTP hooks with purpose = "RESET_PASSWORD"
  const { sendOtp, sending, otpSent, setOtpSent } = useSendOtp("RESET_PASSWORD");
  const { verifyOtp, isVerifying, isVerified, setIsVerified } =
    useVerifyOtp("RESET_PASSWORD");

  // ✅ Send OTP ONLY after checking email exists
  const onSendOtp = async () => {
    const cleaned = email.trim().toLowerCase();
    if (!cleaned) return toast.error("Enter your email");

    try {
      const check = await API.post("/auth/checkemailforreset", { email: cleaned });

      if (!check.data?.success) {
        return toast.error(check.data?.message || "User does not exist");
      }

      setEmail(cleaned);              // keep input normalized
      sessionStorage.setItem("resetEmail", cleaned);

      // ✅ EXACTLY like signup: call sendOtp with cleaned email directly
      sendOtp(cleaned);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to check email");
    }
  };

  // ✅ Auto verify OTP (same pattern as signup)
  useEffect(() => {
    if (otp.length === 6 && !isVerifying && !isVerified) {
      verifyOtp(email.trim().toLowerCase(), otp);
    }
  }, [otp, isVerifying, isVerified, email, verifyOtp]);

  // ✅ After verified, hide OTP UI + clear OTP (same as signup)
  useEffect(() => {
    if (isVerified) {
      setOtp("");
      setOtpSent(false);
    }
  }, [isVerified, setOtpSent]);

  // ✅ Reset password (only after verified)
  const handleResetPassword = async (e) => {
    e.preventDefault();

    const cleaned = email.trim().toLowerCase();
    if (!cleaned) return toast.error("Enter your email");
    if (!isVerified) return toast.error("Verify OTP first");
    if (!newpassword.trim()) return toast.error("Enter new password");

    try {
      const res = await API.post("/auth/reset-password", {
        email: cleaned,
        newpassword,
      });

      if (res.data?.success) {
        toast.success(res.data.message || "Password reset successful");
        Navigate("/login");
      } else {
        toast.error(res.data?.message || "Reset failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8">
        <div className="w-full flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Reset Password 🔑</h2>
            <p className="text-sm text-gray-500 mt-1">
              Verify email with OTP, then set a new password.
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
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
                  onClick={onSendOtp}
                >
                  {sending ? "Sending..." : "Send OTP"}
                </button>
              )}
            </div>

            {isVerified && (
              <>
                <input
                  type="password"
                  placeholder="🔒 Set new password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={newpassword}
                  onChange={(e) => setNewpassword(e.target.value)}
                  required
                />

                <button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-lg transition duration-200"
                >
                  Reset Password
                </button>
              </>
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
                renderInput={(props) => <input {...props} />}
              />

              <p className="text-xs text-gray-500">
                {isVerifying ? "Verifying OTP..." : "Tip: Check spam if you don’t see it."}
              </p>
            </div>
          )}

          <p className="text-sm text-center text-gray-600">
            Back to{" "}
            <span
              onClick={() => Navigate("/login")}
              className="text-amber-500 font-semibold hover:underline cursor-pointer"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
