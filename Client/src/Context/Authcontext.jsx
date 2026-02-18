import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import API from "../Api/api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const didInit = useRef(false);
  const refreshPromiseRef = useRef(null);

  const clearAuth = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  // ✅ cookie-based refresh: backend sets cookies, response returns { user }
  const refreshAccessToken = useCallback(async () => {
    if (refreshPromiseRef.current) return refreshPromiseRef.current;

    refreshPromiseRef.current = (async () => {
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
        refreshPromiseRef.current = null;
      }
    })();

    return refreshPromiseRef.current;
  }, [clearAuth]);

  
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    refreshAccessToken();
  }, [refreshAccessToken]);

  // ✅ login no longer needs token param (cookies are set by backend)
  const login = useCallback((userData) => {
    if (!userData) return;
    setUser(userData);
    setIsLoggedIn(true);
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await API.post("/auth/logout"); // backend should clear cookies
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
