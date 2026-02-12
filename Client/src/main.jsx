import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./Context/Authcontext.jsx";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster />
    <GoogleOAuthProvider clientId="24947228077-fb2k4t5clt6kgmtl0sk31ogi3ea0h3sr.apps.googleusercontent.com">
      <BrowserRouter>
      <AuthProvider>
       
          <App />
        
      </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);
