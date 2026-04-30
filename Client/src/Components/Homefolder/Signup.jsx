import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import OtpInput from "react-otp-input";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import API from "../../Api/api";
import useGoogleAuth from "../../hooks/useGoogleAuth";
import useSendOtp from "../../hooks/useSendOtp";
import useVerifyOtp from "../../hooks/useVerifyOtp";

const Signup = () => {
  const [fullName, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();
  const googleLogin = useGoogleAuth();

  const { sendOtp, sending, otpSent, setOtpSent } = useSendOtp("signup");

  const { verifyOtp, isVerifying, isVerified, setIsVerified } = useVerifyOtp("signup");
    

  
  const signupMutation = useMutation({
    mutationFn: async () => {
      const res = await API.post("/auth/signup", { fullName, email, password });
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Signup failed");
      }
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Signup successful");
      navigate("/login");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || "Signup failed");
    },
  });

  const handleSignup = (e) => {
    e.preventDefault();
    if (signupMutation.isPending) return;

    if (!fullName.trim()) return toast.error("Name is required");
    if (!email.trim()) return toast.error("Email is required");
    if (!password.trim()) return toast.error("Password is required");

    signupMutation.mutate();
  };


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


  useEffect(() => {
    const checkEmailVerification = async () => {
      try {
        const savedEmail = sessionStorage.getItem("signupEmail");
        if (!savedEmail) return;

        const res = await API.post("/auth/verifyemail", { email: savedEmail });

        if (res.data?.success) {
          setEmail(savedEmail);
          setIsVerified(true);
          toast.success("Email verified again");
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || error?.message || "Verify email failed"
        );
      }
    };

    checkEmailVerification();
  }, [setIsVerified]);

  const isCreating = signupMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafbfc] px-4 font-sans relative overflow-hidden">

      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/40 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/40 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white p-10 relative z-10 animate-in fade-in zoom-in-95 duration-700 mt-12 mb-12">
        <div className="w-full flex flex-col gap-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black tracking-tight text-gray-900">
              Create Account ✨
            </h2>
            <p className="text-gray-500 font-medium tracking-wide">
              Join the premium AI blog experience.
            </p>
          </div>

          <form onSubmit={handleSignup} className="flex flex-col gap-5">
            {isVerified && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-400 group-focus-within:text-indigo-600 transition-colors">👤</span>
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 rounded-2xl border border-gray-200 text-gray-900 font-medium tracking-wide focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white transition-all placeholder:text-gray-400 placeholder:font-normal"
                  value={fullName}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="flex gap-3">
              <div className="relative group flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-400 group-focus-within:text-indigo-600 transition-colors">📧</span>
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 rounded-2xl border border-gray-200 text-gray-900 font-medium tracking-wide focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white transition-all placeholder:text-gray-400 placeholder:font-normal disabled:bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed"
                  value={email}
                  disabled={isVerified}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEmail(value);
                    sessionStorage.setItem("signupEmail", value);
                  }}
                  required
                />
              </div>

              {!isVerified && email !== "" && (
                <button
                  className="px-5 py-3.5 bg-gray-900 hover:bg-black text-white font-bold tracking-wide rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:cursor-not-allowed whitespace-nowrap"
                  type="button"
                  disabled={sending}
                  onClick={() => sendOtp(email)}
                >
                  {sending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              )}
            </div>

            {isVerified && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-400 group-focus-within:text-indigo-600 transition-colors">🔒</span>
                </div>
                <input
                  type="password"
                  placeholder="Set Password"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 rounded-2xl border border-gray-200 text-gray-900 font-medium tracking-wide focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white transition-all placeholder:text-gray-400 placeholder:font-normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}

            
            {isVerified && (
              <button
                type="submit"
                disabled={isCreating}
                className={`group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl text-white bg-gray-900 hover:bg-black font-bold tracking-wide transition-all shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none overflow-hidden mt-2 ${isCreating ? "blur-[1px]" : ""}`}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                {isCreating ? "Creating Account..." : "Create Account"}
              </button>
            )}
          </form>

          {otpSent && (
            <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-6 flex flex-col items-center gap-5 shadow-inner">
              <p className="text-sm font-semibold text-gray-700 tracking-wide">
                We sent a 6-digit code to your email
              </p>

              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                disabled={isVerifying}
                containerStyle={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "0.5rem",
                  width: "100%",
                }}
                inputStyle={{
                  width: "3rem",
                  height: "3.5rem",
                  borderRadius: "0.75rem",
                  border: "2px solid #e5e7eb",
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  textAlign: "center",
                  background: "white",
                  color: "#111827",
                  transition: "all 0.2s"
                }}
                focusStyle={{
                  outline: "none",
                  borderColor: "#4f46e5",
                  boxShadow: "0 0 0 4px rgba(79, 70, 229, 0.1)",
                }}
                renderInput={(props) => <input {...props} />}
              />

              <p className="text-xs font-medium text-gray-500">
                {isVerifying ? (
                  <span className="flex items-center gap-2 text-indigo-600">
                    <div className="w-3 h-3 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
                    Verifying securely...
                  </span>
                ) : (
                  "Tip: Check your spam folder if you don't see it."
                )}
              </p>
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/80 text-gray-400 font-semibold tracking-widest uppercase">Or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={googleLogin}
            className="w-full bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-bold tracking-wide py-3.5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <img src={assets.google} alt="Google" className="w-6 h-6 object-contain" />
            <span>Continue with Google</span>
          </button>

          <p className="text-center text-gray-500 font-medium">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors cursor-pointer"
            >
              Sign In
            </span>
          </p>

          <div className="mt-2 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Powered by Groq ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Signup;
