import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import API, { tokenStore } from "../Api/api";
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
    tokenStore.clear();
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  // ✅ cookie-based refresh: backend sets cookies, response returns { user }
  const refreshAccessToken = useCallback(async () => {
    if (refreshPromiseRef.current) return refreshPromiseRef.current;

    refreshPromiseRef.current = (async () => {
      try {
        const refreshToken = tokenStore.getRefreshToken();
        const res = await API.post(
          "/auth/refreshtoken",
          refreshToken ? { refreshToken } : {}
        );
        const u = res.data?.user;

        if (!u) throw new Error("Invalid refresh response: user missing");

        tokenStore.setTokens({
          accessToken: res.data?.accessToken,
          refreshToken: res.data?.refreshToken,
        });
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


  const login = useCallback((userData, accessToken, refreshToken) => {
    if (!userData) return;
    tokenStore.setTokens({ accessToken, refreshToken });
    setUser(userData);
    setIsLoggedIn(true);
    setLoading(false);
  }, []);


  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await API.post("/auth/logout", {
        refreshToken: tokenStore.getRefreshToken(),
      }); 
    } catch (err) {
      console.log("Logout API failed:", err?.response?.data || err.message);
    } finally {
      clearAuth();
      setIsLoggingOut(false);
      navigate("/login", { replace: true });
    }
  }, [clearAuth, navigate]);



  useEffect(() => {
    const onLogout = () => {
      logout();
    };

    window.addEventListener("auth:logout", onLogout);
    return () => {
      window.removeEventListener("auth:logout", onLogout);
    };
  }, [logout]);


  
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
