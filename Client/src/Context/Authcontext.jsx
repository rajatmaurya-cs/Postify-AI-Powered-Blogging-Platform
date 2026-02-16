
// import { createContext, useEffect, useState } from "react";
// import API from "../Api/api";
// import { setAccessToken } from "../Api/axiosInterceptor";
// import { useNavigate } from "react-router-dom";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {

//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [loading, setLoading] = useState(true);


//   const refreshAccessToken = async () => {
//     try {

      
//       const res = await API.post("/auth/refreshtoken");
    
//       setAccessToken(res.data.accessToken);

//       setUser(res.data.user);
//       setIsLoggedIn(true);

//     } catch (error) {

//       console.log("Refresh failed:", error.response?.data);
//       clearAuth();

//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {

//     const initAuth = async () => {
//       await refreshAccessToken();
//     };

//     initAuth();

    

//   }, []);


//   const login = (userData, token) => {

//     setAccessToken(token);

//     setUser(userData);
//     setIsLoggedIn(true);
//   };


//   const logout = async () => {
//     try {
//       await API.post("/auth/logout");
//     } catch (err) {
//       console.log(err);
//     }

//     clearAuth();
//     navigate("/login");
//   };

//   const clearAuth = () => {
//     setUser(null);
//     setIsLoggedIn(false);
//     setAccessToken(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isLoggedIn,
//         loading,
//         login,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import API from "../Api/api";
import { setAccessToken } from "../Api/axiosInterceptor";
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
    setAccessToken(null);
  }, []);

  const refreshAccessToken = useCallback(async () => {
    if (refreshPromiseRef.current) return refreshPromiseRef.current;

    refreshPromiseRef.current = (async () => {
      try {
        const res = await API.post("/auth/refreshtoken");

        const token = res.data?.accessToken;
        const u = res.data?.user;

        if (!token || !u) throw new Error("Invalid refresh response");

        setAccessToken(token);
        setUser(u);
        setIsLoggedIn(true);

        return token;
      } catch (error) {
        console.log("Refresh failed:", error?.response?.data || error.message);
        clearAuth();
        return null;
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




  const login = useCallback((userData, token) => {
    if (!token || !userData) return;
    setAccessToken(token);
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
  () => ({ user, isLoggedIn, loading, login, isLoggingOut, logout, refreshAccessToken }),
  [user, isLoggedIn, loading, isLoggingOut, login, logout, refreshAccessToken]
);



  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
