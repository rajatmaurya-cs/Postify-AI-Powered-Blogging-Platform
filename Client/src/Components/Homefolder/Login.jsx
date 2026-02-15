import { useState } from "react";
import API from "../../Api/api";
import { useContext } from "react";
import { AuthContext } from '../../Context/Authcontext'
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast'
import { assets } from "../../assets/assets";

import useGoogleAuth from "../../hooks/useGoogleAuth";



const Login = () => {
  const { login } = useContext(AuthContext)
  const Navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Loading, setLoading] = useState(false);

  const handlelogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      if (res.data.success) {
        console.log(res.data.accessToken)
        login(res.data.user, res.data.accessToken);

        toast.success("Login successful");

        const role = res.data.user.role;

        if (role === 'USER') Navigate("/");

        else if (role === 'ADMIN') Navigate('/admin')
      }
      else {
        toast.error(res.data.message);
        return;
      }

    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
    finally{
      setLoading(false)
    }
  };

  const googleLogin = useGoogleAuth();

 return (
  <>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8">

        <div className="w-full flex flex-col gap-6">

          <form onSubmit={handlelogin} className="flex flex-col gap-5">
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              Welcome Back 👋
            </h2>

            <p className="text-sm text-gray-500 text-center">
              Login to continue.
            </p>

            <input
              type="email"
              placeholder="📧 Enter your email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="🔒 Enter your password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex justify-end">
              <p
                onClick={() => Navigate("/forgot-password")}
                className="text-sm text-amber-500 hover:underline cursor-pointer"
              >
                Forgot Password?
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-black text-white 
              font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-60"
              disabled={Loading}
            >
              {Loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <span
              onClick={() => Navigate("/signup")}
              className="text-amber-500 font-semibold hover:underline cursor-pointer"
            >
              Create one
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
            <img
              src={assets.google}
              alt="Google"
              className="w-5 h-5 object-contain"
            />
            <span>Sign in with Google</span>
          </button>

          <p className="text-xs text-center text-gray-500">
            Powered by Groq ✨
          </p>

        </div>
      </div>
    </div>
  </>
);

};

export default Login;
