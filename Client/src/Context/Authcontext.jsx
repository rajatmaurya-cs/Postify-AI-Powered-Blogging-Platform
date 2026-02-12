// import { createContext, useEffect, useState } from "react";
// import API from "../Api/api"; // axios instance withCredentials:true
// import toast from 'react-hot-toast'
// export const AuthContext = createContext();
// import { useNavigate } from "react-router-dom";
// import { setAccessToken } from "../Api/axiosInterceptor";
// import 
// export const AuthProvider = ({ children }) => {
//   const Navigate = useNavigate()


//   const [isLoggedIn, setIsLoggedIn] = useState(
//     JSON.parse(localStorage.getItem("isLoggedIn")) || false
//   );

//   const [user, setUser] = useState(
//     JSON.parse(localStorage.getItem("user")) || null
//   );

//   const [accessToken, setAccessToken] = useState(null);

//   const [loading, setLoading] = useState(true);



//   const refreshAccessToken = async () => {
//     try {
      
//     const res = await   API.post("/auth/refreshtoken")

//       getAccessToken(res.data.accessToken); // sendgin Token to axiosInterceptor

//       setIsLoggedIn(true);

//       setUser(res.data.user);

      

//     } catch (error) {
//       console.log(error)
//       clearAuth();
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     refreshAccessToken();
//   }, []);



//   const login = (userData, Token) => {
//     getAccessToken(Token) // Sendgin Token to apiinterceptor
//     setAccessToken(Token);
//     setIsLoggedIn(true);
//     setUser(userData);

//     localStorage.setItem("isLoggedIn", true);
//     localStorage.setItem("user", JSON.stringify(userData));
//   };


//   const logout = async () => {
//     try {
//       console.log("Entered in fronted logout")
//       await API.post("/auth/logout");
//       Navigate('/')
//     } catch (error) {

//       toast.error(error.message)
//     }
//     toast.success("User Logout");
//     Navigate('/')

//     clearAuth();
//   };


//   const clearAuth = () => {
//     setIsLoggedIn(false);
//     setUser(null);

//     localStorage.removeItem("isLoggedIn");
//     localStorage.removeItem("user");

//   };




//   return (
//     <AuthContext.Provider
//       value={{
//         isLoggedIn,
//         user,
//         loading,
//         login,
//         logout,
//         accessToken,

//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };




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
