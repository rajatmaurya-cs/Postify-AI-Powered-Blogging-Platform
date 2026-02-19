


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
        purpose, 
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
    
    isVerifying: mutation.isPending,
    isVerified,
    setIsVerified,
  };
}
