import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import API from '../../Api/api';
import OtpInput from "react-otp-input";
import useSendOtp from '../../hooks/useSendOtp';
import useVerifyOtp from '../../hooks/useVerifyOtp';
import { useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [newpassword, setnewpassword] = useState("");
  const [otp, setOtp] = useState("")


  const { setOtpSent, sending, setSending, otpSent } = useSendOtp();
  const { verifyOtp, isVerifying, isVerified, setIsVerified } = useVerifyOtp();

  const mailchecker = async () => {
    try {

      setSending(true)
      const res = await API.post('/auth/checkemailforreset', { email })
      if (res.data.success) {
        console.log(res.data.message); // OTP sent successfully
        toast.success(res.data.message)
        setOtpSent(true)

      }
      if (!res.data.success) {
        console.log(res.data.message) // User does not exits
        toast.error(res.data.message)

      }
    } catch (error) {

      const message =

        //   error = {
        //   response: {
        //      status: 429,
        //      data: {
        //         success:false,
        //         message:"Too many requests"
        //      }
        //   }
        // }

        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";

      toast.error(message);
      console.log(message);
    } finally {
      setSending(false);
    }
  }


  useEffect(() => {
    if (otp.length === 6) {
      console.log("Entered in otp length hook")
      verifyOtp(email, otp, setOtpSent);


    }
  }, [otp]);


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

  }, []);  // For checkEmail verificaiton from sessionstorage



  const resetpassword = async (e) => {
    e.preventDefault();
    try {

      console.log("Entered in resetpassword fronted")
      const res = await API.post('/auth/reset-password', { email, newpassword })
      if (res.data.success) {
        console.log("success function of fronted")
        toast.success(res.data.message);
        navigate('/login')
      }
      else {
        toast.success(res.data.message)
      }


    } catch (error) {
      console.log(error)
    }

  }

return (
  <>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8">
        <div className="w-full flex flex-col gap-6">

          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Reset Password 🔑</h2>
            <p className="text-sm text-gray-500 mt-1">
              Verify your email with OTP, then set a new password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={resetpassword} className="flex flex-col gap-4">

            {/* Email + Send OTP */}
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="📧 Enter your email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100"
                value={email}
                disabled={isVerified}
                onChange={(e) => {
                  const value = e.target.value;
                  setEmail(value);
                  sessionStorage.setItem("signupEmail", value);
                }}
                required
              />

              {!isVerified && email !== "" && (
                <button
                  className="px-4 py-3 bg-gray-900 hover:bg-black text-white rounded-lg whitespace-nowrap transition disabled:opacity-60"
                  type="button"
                  disabled={sending}
                  onClick={mailchecker}
                >
                  {sending ? "Sending..." : "Send OTP"}
                </button>
              )}
            </div>

            {/* New password */}
            {isVerified && (
              <input
                type="password"
                placeholder="🔒 Set new password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={newpassword}
                onChange={(e) => setnewpassword(e.target.value)}
                required
              />
            )}

            {/* Reset button */}
            {isVerified && (
              <button
                type="submit"
                className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                Reset Password
              </button>
            )}
          </form>

          {/* OTP Box */}
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
                  boxShadow: "0 0 0 3px rgba(245, 158, 11, 0.25)",
                }}
                renderInput={(props) => <input {...props} />}
              />

              <p className="text-xs text-gray-500">
                {isVerifying ? "Verifying OTP..." : "Check spam if you don’t see it."}
              </p>
            </div>
          )}

          {/* Back to login */}
          <p className="text-sm text-center text-gray-600">
            Remember your password?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-amber-500 font-semibold hover:underline cursor-pointer"
            >
              Login
            </span>
          </p>

        </div>
      </div>
    </div>
  </>
);

}

export default ForgetPassword
