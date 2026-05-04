import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import API from "../../Api/api";
import { AuthContext } from "../../Context/Authcontext";
import { assets } from "../../assets/assets";
import useGoogleAuth from "../../hooks/useGoogleAuth";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ React Query mutation for login
  const loginMutation = useMutation({

    mutationFn: async ({ email, password }) => {
      
      const res = await API.post("/auth/login", { email, password });

      // Normalize errors so onError runs properly
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Login failed");
      }

      return res.data; // { success, user, accessToken, ... }
    },

    onSuccess: (data) => {

      login(data.user, data.accessToken);

      toast.success("Login successful");

      navigate("/admin");

      
    },

     onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";

      toast.error(msg);
    },
  });

  const handlelogin = (e) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  const googleLogin = useGoogleAuth();

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#fafbfc] px-4 font-sans relative overflow-hidden">
        {/* Abstract Background Ornaments */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/40 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/40 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white p-10 relative z-10 animate-in fade-in zoom-in-95 duration-700">
          <div className="w-full flex flex-col gap-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 font-[family-name:var(--font-display)]">
                Welcome Back
              </h2>
              <p className="text-gray-500 font-normal tracking-normal">
                Sign in to continue to Postify.
              </p>
            </div>

            <form onSubmit={handlelogin} className="flex flex-col gap-5">
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400 group-focus-within:text-indigo-600 transition-colors">📧</span>
                  </div>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 rounded-2xl border border-gray-200 text-gray-900 font-normal tracking-normal focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white transition-all placeholder:text-gray-400 placeholder:font-normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400 group-focus-within:text-indigo-600 transition-colors">🔒</span>
                  </div>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 rounded-2xl border border-gray-200 text-gray-900 font-normal tracking-normal focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white transition-all placeholder:text-gray-400 placeholder:font-normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <p
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                >
                  Forgot Password?
                </p>
              </div>

              <button
                type="submit"
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl text-white bg-gray-900 hover:bg-black font-semibold tracking-normal transition-all shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none overflow-hidden"
                disabled={loginMutation.isPending}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                {loginMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </span>
                ) : (
                  <span className="relative z-10">Sign In</span>
                )}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-gray-400 font-medium tracking-widest uppercase">Or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={googleLogin}
              className="w-full bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold tracking-normal py-3.5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              disabled={loginMutation.isPending}
            >
              <img
                src={assets.google}
                alt="Google"
                className="w-6 h-6 object-contain"
                loading="lazy"
                decoding="async"
              />
              <span>Continue with Google</span>
            </button>

            <p className="text-center text-gray-500 font-normal mt-2">
              New to Postify?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors cursor-pointer"
              >
                Create an account
              </span>
            </p>

            <div className="mt-4 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
                Powered by Groq ✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
