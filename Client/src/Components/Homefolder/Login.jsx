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

  const handlelogin = async (e) => {
    e.preventDefault(); 
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      if (res.data.success) {
        console.log(res.data.accessToken)
        login(res.data.user , res.data.accessToken);

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
  };

  const googleLogin = useGoogleAuth();

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">


          <div className="w-full md:w-1/2 flex items-center justify-center p-8">
            <div className="w-full max-w-sm flex flex-col gap-6">


              <form
                onSubmit={handlelogin}
                className="flex flex-col gap-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 text-center">
                  Welcome Back 👋
                </h2>

                <p className="text-sm text-gray-500 text-center">
                  Login to continue to your AI Blog
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
                  className="w-full bg-gray-300 hover:bg-gray-800 text-black hover:text-white 
        font-semibold py-3 rounded-lg transition duration-200"
                >
                  Login
                </button>
              </form>


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
                  onClick={() => googleLogin}
                />
                <span>Sign in with Google</span>
              </button>

              <p className="text-xs text-center text-gray-500">
                Powered by AI ✨
              </p>

            </div>
          </div>



          <div className="hidden md:block md:w-1/2">
            <img
              src={assets.login_image}
              alt="AI Blog Login"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </div>



    </>

  );
};

export default Login;
