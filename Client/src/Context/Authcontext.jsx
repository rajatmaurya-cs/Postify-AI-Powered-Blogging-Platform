import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import API from "../Api/api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);


let refreshPromiseRef = null;


export const AuthProvider = ({ children }) => {
  
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [loading, setLoading] = useState(true);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const didInit = useRef(false);

  
  const clearAuth = useCallback(() => {

    setUser(null);

    setIsLoggedIn(false);

  }, []);


  const refreshAccessToken = useCallback(async () => {

    if (refreshPromiseRef) return refreshPromiseRef;

    refreshPromiseRef = (async () => {

      try {

        const res = await API.post("/auth/refreshtoken");

        const u = res.data?.user;

        if (!u) throw new Error("Invalid refresh response: user missing");

        setUser(u);

        setIsLoggedIn(true);

        return true;

      } catch (error) {

        console.log("Refresh failed:", error?.response?.data || error.message);

        clearAuth();

        return false;

      } finally {

        setLoading(false);

        refreshPromiseRef = null;
      }
    })();

    return refreshPromiseRef;
  }, [clearAuth]);

  
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    refreshAccessToken();
  }, [refreshAccessToken]);

 
  const login = useCallback((userData) => {
    if (!userData) return;
    setUser(userData);
    setIsLoggedIn(true);
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await API.post("/auth/logout"); 
    } catch (err) {
      console.log("Logout API failed:", err?.response?.data || err.message);
    } finally {
      clearAuth();
      setIsLoggingOut(false);
      navigate("/login", { replace: true });
    }
  }, [clearAuth, navigate]);

  const value = useMemo(
    () => ({
      user,
      isLoggedIn,
      loading,
      login,
      logout,
      isLoggingOut,
      refreshAccessToken,
    }),
    [user, isLoggedIn, loading, login, logout, isLoggingOut, refreshAccessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};