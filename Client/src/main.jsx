import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./Context/Authcontext.jsx";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const queryClient = new QueryClient();

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <Toaster />
//     <GoogleOAuthProvider clientId="24947228077-fb2k4t5clt6kgmtl0sk31ogi3ea0h3sr.apps.googleusercontent.com">
//       <QueryClientProvider client={queryClient}>
//         <AuthProvider>
//           <BrowserRouter>
//             <App />
//           </BrowserRouter>
//         </AuthProvider>
//       </QueryClientProvider>
//     </GoogleOAuthProvider>
//   </StrictMode>
// );
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="24947228077-fb2k4t5clt6kgmtl0sk31ogi3ea0h3sr.apps.googleusercontent.com">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <App />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
