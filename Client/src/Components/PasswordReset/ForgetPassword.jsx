import  { useEffect, useState } from "react";
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


  const resetPasswordMutation = useMutation({
    mutationFn: async ({ email, newpassword }) => {
      const res = await API.post("/auth/reset-password", {
        email,
        newpassword,
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
      newpassword: newPassword,
    });
  };




  useEffect(() => {

    const checkEmailVerification = async () => {

      try {

        const savedEmail = sessionStorage.getItem("forgetEmail");

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
    <div className="min-h-screen flex items-center justify-center relative bg-[#fafbfc] px-4 font-sans overflow-hidden">
      {/* Background Ornaments matching Login/Signup */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
        <div className="w-[600px] h-[600px] bg-gradient-to-br from-indigo-100/40 to-purple-100/40 rounded-full blur-3xl opacity-70"></div>
      </div>
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
        <div className="w-[800px] h-[800px] bg-gradient-to-tr from-blue-50/50 to-emerald-50/50 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="w-full max-w-[440px] relative z-10 animate-in fade-in zoom-in-95 duration-700">
        
        {/* Brand Logo / Header Area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-6">
            <span className="text-2xl">🔑</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2 font-[family-name:var(--font-display)]">Reset Password</h2>
          <p className="text-gray-500 font-normal tracking-normal">Enter your email to receive a recovery code.</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-white p-8 sm:p-10">
          <form onSubmit={handleResetPassword} className="space-y-6">
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 text-sm font-medium rounded-2xl p-4 placeholder:font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all disabled:opacity-60 disabled:bg-gray-100"
                  value={email}
                  disabled={isVerified}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEmail(value);
                    sessionStorage.setItem("forgetEmail", value);
                  }}
                  required
                />
                
                {!isVerified && email !== "" && (
                  <button
                    type="button"
                    disabled={sending}
                    onClick={() => sendOtp(email)}
                    className="flex-shrink-0 px-6 bg-gray-900 text-white font-semibold text-sm tracking-normal rounded-2xl hover:bg-black transition-all shadow-[0_4px_15px_rgb(0,0,0,0.1)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgb(0,0,0,0.15)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    {sending ? "Sending..." : "Send OTP"}
                  </button>
                )}
              </div>

              {otpSent && !isVerified && (
                <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-2xl p-6 flex flex-col items-center gap-4 animate-in slide-in-from-top-2 duration-300">
                  <p className="text-sm font-medium tracking-normal text-indigo-900">Enter validation code</p>
                  <div className="flex justify-center w-full">
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={6}
                      disabled={isVerifying}
                      containerStyle={{ display: "flex", justifyContent: "center", gap: "8px" }}
                      inputStyle={{
                        width: "42px",
                        height: "48px",
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                        backgroundColor: "#ffffff",
                        fontSize: "18px",
                        fontWeight: "800",
                        color: "#111827",
                        textAlign: "center",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
                      }}
                      renderInput={(props) => <input {...props} className="focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all font-sans" />}
                    />
                  </div>
                  <p className="text-xs font-medium text-indigo-500/70 tracking-normal">
                    {isVerifying ? "Verifying code..." : "Check your spam folder if not received."}
                  </p>
                </div>
              )}

              {isVerified && (
                <div className="space-y-4 animate-in fade-in duration-500">
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 text-sm font-medium rounded-2xl p-4 placeholder:font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="w-full group relative inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-semibold tracking-normal rounded-2xl overflow-hidden transition-all shadow-[0_8px_20px_rgb(0,0,0,0.12)] hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgb(0,0,0,0.2)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none mt-2"
                    disabled={resetPasswordMutation.isPending}
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span className="relative z-10 flex items-center gap-2">
                       {resetPasswordMutation.isPending ? "Validating..." : "Update Password"}
                    </span>
                  </button>
                </div>
              )}

            </div>
          </form>

          <div className="mt-8 text-center bg-gray-50/50 mx-[-2.5rem] mb-[-2.5rem] p-6 rounded-b-[2.5rem] border-t border-gray-100/80">
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
