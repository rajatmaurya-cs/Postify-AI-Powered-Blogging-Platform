

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import API from "../Api/api";
import toast from "react-hot-toast";

export default function useSendOtp(purpose) {
  const [otpSent, setOtpSent] = useState(false);

  const mutation = useMutation({
    mutationFn: async ({ email }) => {
      const res = await API.post("/auth/sendotp", {
        email,
        purpose,
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.message || "OTP sent successfully");
        setOtpSent(true);
      } else {
        toast.error(data?.message || "Failed to send OTP");
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err.message || "Failed to send OTP");
    },
  });

  return {
    sendOtp: (email) => mutation.mutate({ email }),
    sendOtpAsync: (email) => mutation.mutateAsync({ email }),
    sending: mutation.isPending,
    otpSent,
    setOtpSent,
  };
}
