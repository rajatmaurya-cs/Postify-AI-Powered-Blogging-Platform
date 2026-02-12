import { useGoogleLogin } from "@react-oauth/google";
import { useContext } from "react";
import { AuthContext } from "../Context/Authcontext"
import API from "../Api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useGoogleAuth = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const responseGoogle = async (authResult) => {
    try {
      if (!authResult?.code) return;

      const result = await API.post("/user/GoogleLogin", {
        code: authResult.code,
      });

      if (!result?.data?.success || !result?.data?.user) {
        toast.error("Google authentication failed");
        return;
      }

      const user = result.data.user;

     
      login(user);

      toast.success("Google authentication successful");

      
      if (user.role === "USER") navigate("/");
      else if (user.role === "ADMIN") navigate("/admin");

    } catch (error) {
      console.log("Google auth error:", error.response?.data || error.message);
      toast.error("Google authentication failed");
    }
  };

  const googleAuth = useGoogleLogin({
    flow: "auth-code",
    onSuccess: responseGoogle,
    onError: (error) => {
      console.log("Google Auth Failed:", error);
      toast.error("Google authentication failed");
    },
  });

  return googleAuth;
};

export default useGoogleAuth;
