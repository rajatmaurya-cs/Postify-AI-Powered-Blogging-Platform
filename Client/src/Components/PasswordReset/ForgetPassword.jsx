import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import API from "../../Api/api";
import useSendOtp from "../../hooks/useSendOtp";
import useVerifyOtp from "../../hooks/useVerifyOtp";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();


  const { sendOtp, sending, otpSent, setOtpSent } = useSendOtp("forgetPassword");
  const { verifyOtp, isVerifying, isVerified, setIsVerified } = useVerifyOtp("forgetPassword");




  // const handleResetPassword = async (e) => {
  //   e.preventDefault();

  //   try {
  //     // ✅ Sending 'purpose' here as well because your backend requires it
  //     const res = await API.post("/auth/reset-password", {
  //       email,
  //       newPassword,

  //     });

  //     if (res.data.success) {
  //       toast.success(res.data.message || "Password reset successful");
  //       navigate("/login");
  //     } else {
  //       toast.error(res.data.message || "Reset failed");
  //     }
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message || error.message || "Reset failed");
  //   }
  // };



  const resetPasswordMutation = useMutation({
    mutationFn: async ({ email, newpassword  }) => {
      const res = await API.post("/auth/reset-password", {
        email,
       newpassword ,  // Backend needs newPassword in loweser case 
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.message || "Password reset successful");
        navigate("/login");
      } else {
        toast.error(data?.message || "Reset failed");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message || "Reset failed");
    },
  });


  useEffect(() => {
    if (otp.length === 6 && !isVerifying && !isVerified) {
      verifyOtp(email, otp);
    }
  }, [otp, isVerifying, isVerified, email, verifyOtp]);


  useEffect(() => {
    if (isVerified) {
      setOtp("");
      setOtpSent(false);
    }
  }, [isVerified, setOtpSent]);







  const handleResetPassword = (e) => {
    e.preventDefault();

    resetPasswordMutation.mutate({
      email,
      newPassword,
    });
  };















  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8">
        <div className="w-full flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Reset Password 🔑</h2>
            <p className="text-sm text-gray-500 mt-1">Verify your email to set a new password</p>
          </div>

          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            {/* Email Input */}
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

            {/* Password Input - Only shown after OTP is verified */}
            {isVerified && (
              <>
                <input
                  type="password"
                  placeholder="🔒 Enter new password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-lg transition duration-200"
                  disabled={resetPasswordMutation.isPending}
                >
                  {resetPasswordMutation.isPending ? "Updating..." : "Update Password"}
                </button>
              </>
            )}
          </form>

          {/* OTP Input Box */}
          {otpSent && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 flex flex-col items-center gap-3">
              <p className="text-sm font-medium text-gray-700">Enter 6-digit OTP</p>
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                disabled={isVerifying}
                containerStyle={{ display: "flex", justifyContent: "center", gap: "10px" }}
                inputStyle={{
                  width: "44px",
                  height: "46px",
                  borderRadius: "10px",
                  border: "2px solid #d1d5db",
                  fontSize: "18px",
                  fontWeight: "600",
                  textAlign: "center",
                }}
                renderInput={(props) => <input {...props} />}
              />
              <p className="text-xs text-gray-500">
                {isVerifying ? "Verifying..." : "Didn't get it? Check your spam folder."}
              </p>
            </div>
          )}

          <div className="text-center">
            <span
              onClick={() => navigate("/login")}
              className="text-amber-500 font-semibold hover:underline cursor-pointer text-sm"
            >
              Back to Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;