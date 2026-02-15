import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import OtpInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import API from "../../Api/api";
import useSendOtp from "../../hooks/useSendOtp";
import useVerifyOtp from "../../hooks/useVerifyOtp";

const ForgetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [otp, setOtp] = useState("");

  // ✅ purpose-based OTP
  const { sendOtp, sending, otpSent, setOtpSent } = useSendOtp("RESET_PASSWORD");
  const { verifyOtp, isVerifying, isVerified, setIsVerified } =
    useVerifyOtp("RESET_PASSWORD");

  // ✅ 1) Check email exists mutation
  const checkEmailMutation = useMutation({
    mutationFn: async (checkedEmail) => {
      const res = await API.post("/auth/checkemailforreset", {
        email: checkedEmail,
      });
      return res.data;
    },

    // ✅ Use React Query "variables" param to avoid stale state
    onSuccess: (data, checkedEmail) => {
      if (data?.success) {
        toast.success("Email found. Sending OTP...");
        sendOtp(checkedEmail); // ✅ FIXED (no stale email)
        // ❌ don't setOtpSent(true) here; useSendOtp already does it on success
      } else {
        toast.error(data?.message || "User does not exist");
      }
    },

    onError: (err) => {
      toast.error(
        err?.response?.data?.message || err.message || "Something went wrong"
      );
    },
  });

  // ✅ 2) Auto verify when OTP length becomes 6
  useEffect(() => {
    if (otp.length === 6 && !isVerifying && !isVerified) {
      const cleaned = email.trim().toLowerCase();
      if (!cleaned) return;
      verifyOtp(cleaned, otp);
    }
  }, [otp, isVerifying, isVerified, email, verifyOtp]);

  // ✅ Hide OTP UI after verified + clear otp
  useEffect(() => {
    if (isVerified) {
      setOtp("");
      setOtpSent(false);
    }
  }, [isVerified, setOtpSent]);

  // ✅ 3) Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ email: resetEmail, newpassword: newPass }) => {
      const res = await API.post("/auth/reset-password", {
        email: resetEmail,
        newpassword: newPass,
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

    onError: (err) => {
      toast.error(err?.response?.data?.message || err.message || "Reset failed");
    },
  });

  const onSendOtp = () => {
    const cleaned = email.trim().toLowerCase();
    if (!cleaned) return toast.error("Enter email");

    // keep UI input normalized
    setEmail(cleaned);
    sessionStorage.setItem("resetEmail", cleaned);

    checkEmailMutation.mutate(cleaned);
  };

  const resetpassword = (e) => {
    e.preventDefault();

    const cleaned = email.trim().toLowerCase();
    if (!cleaned) return toast.error("Enter email");
    if (!isVerified) return toast.error("Verify OTP first");
    if (!newpassword.trim()) return toast.error("Enter new password");

    resetPasswordMutation.mutate({ email: cleaned, newpassword });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8">
        <div className="w-full flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Reset Password 🔑
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Verify email with OTP, then set a new password.
            </p>
          </div>

          <form onSubmit={resetpassword} className="flex flex-col gap-4">
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
                  disabled={sending || checkEmailMutation.isPending}
                  onClick={onSendOtp}
                >
                  {sending || checkEmailMutation.isPending
                    ? "Sending..."
                    : "Send OTP"}
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
                  disabled={resetPasswordMutation.isPending}
                  className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-60"
                >
                  {resetPasswordMutation.isPending
                    ? "Resetting..."
                    : "Reset Password"}
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
                {isVerifying
                  ? "Verifying OTP..."
                  : "Check spam if you don’t see it."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
