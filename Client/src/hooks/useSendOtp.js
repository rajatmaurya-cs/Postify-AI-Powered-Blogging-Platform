// import { useState } from "react";
// import API from "../Api/api";
// import toast from "react-hot-toast";

// const useSendOtp = () => {

//     const [sending, setSending] = useState(false);
//     const [otpSent, setOtpSent] = useState(false);

//     const sendOtp = async (email) => {
//         if (!email) {
//             toast.error("Email is required");
//             return;
//         }
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//         if (!emailRegex.test(email)) {
//             toast.error("Please enter a valid email address");
//             return;
//         }

//         try {
//             setSending(true);
//             console.log("Entered in sendOtp fronted function")

//             const res = await API.post('/auth/sendotp', { email });

//             if (res.data.success) {
//                 toast.success(res.data.message);
//                 setOtpSent(true);
//             }

//         } catch (error) {
//             toast.error(error.response?.data?.message || "Failed to send OTP");
//         } finally {
//             setSending(false);
//         }
//     };

//     return { sendOtp, sending, setSending, otpSent, setOtpSent };
// };

// export default useSendOtp;


import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import API from "../Api/api";
import toast from "react-hot-toast";

export default function useVerifyOtp(purpose) {
  const [isVerified, setIsVerified] = useState(false);

  const mutation = useMutation({
    mutationFn: async ({ email, otp }) => {
      const res = await API.post("/auth/verifyotp", {
        email,
        otp,
        purpose, // ✅ send purpose to backend
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        setIsVerified(true);
        toast.success(data.message || "OTP verified successfully");
      } else {
        toast.error(data?.message || "Invalid OTP");
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err.message || "OTP verification failed");
    },
  });

  return {
    verifyOtp: (email, otp) => mutation.mutate({ email, otp }),
    verifyOtpAsync: (email, otp) => mutation.mutateAsync({ email, otp }),
    isVerifying: mutation.isPending,
    isVerified,
    setIsVerified,
  };
}
