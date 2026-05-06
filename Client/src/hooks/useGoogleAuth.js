import { useGoogleLogin } from "@react-oauth/google";
import { useContext } from "react";
import { AuthContext } from "../Context/Authcontext"
import API from "../Api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useGoogleAuth = (setGoogleLoading) => {

  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const responseGoogle = async (authResult) => {

    try {
      



      if (!authResult?.code) return;

      console.log("The Authorizarion code is : ", authResult.code)

      const result = await API.post("/auth/google", {
        code: authResult.code,
      });

      console.log("The Result is : ", result)

      if (!result?.data?.success || !result?.data?.user) {
        toast.error("Google authentication failed");
        return;
      }

      login(result.data.user, result.data.accessToken);



      toast.success("Google authentication successful");
      window.history.replaceState({}, document.title, "/login");
      sessionStorage.removeItem("googleAuthPending");
      navigate("/admin");

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
      sessionStorage.removeItem("googleAuthPending");
      setGoogleLoading?.(false);
      
    },
  });
 const startGoogleAuth = () => {
    sessionStorage.setItem("googleAuthPending", "true");
    setGoogleLoading?.(true);
    googleAuth();
  };

  return startGoogleAuth;

};

export default useGoogleAuth;
