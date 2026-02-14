
import { createContext, useEffect, useState } from "react";
import API from "../Api/api";
import { setAccessToken } from "../Api/axiosInterceptor";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);


  const refreshAccessToken = async () => {
    try {

      
      const res = await API.post("/auth/refreshtoken");
    
      setAccessToken(res.data.accessToken);

      setUser(res.data.user);
      setIsLoggedIn(true);

    } catch (error) {

      console.log("Refresh failed:", error.response?.data);
      clearAuth();

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    const initAuth = async () => {
      await refreshAccessToken();
    };

    initAuth();

    

  }, []);


  const login = (userData, token) => {

    setAccessToken(token);

    setUser(userData);
    setIsLoggedIn(true);
  };


  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      console.log(err);
    }

    clearAuth();
    navigate("/login");
  };

  const clearAuth = () => {
    setUser(null);
    setIsLoggedIn(false);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
