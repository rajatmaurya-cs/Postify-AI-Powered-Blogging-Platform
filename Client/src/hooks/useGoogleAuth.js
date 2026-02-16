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

      console.log("The Authorizarion code is : ",authResult.code)

      const result = await API.post("/auth/google", {
        code: authResult.code,
      });

        console.log("The Result is : ",result)

      if (!result?.data?.success || !result?.data?.user) {
        toast.error("Google authentication failed");
        return;
      }

      const user = result.data.user;

     
      

      toast.success("Google authentication successful");
      login(result.data.user, result.data.accessToken);

      
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
