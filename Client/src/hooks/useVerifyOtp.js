import { useState } from "react";
import API from "../Api/api";
import toast from "react-hot-toast";

const useVerifyOtp = () => {

    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const verifyOtp = async (email, otp, setOtpSent) => {

        if (!email || !otp) {
            toast.error("Email and OTP are required");
            return;
        }

        try {
            setIsVerifying(true);

            const res = await API.post('/auth/verifyotp', { email, otp });

            if (res.data.success) {
                setIsVerified(true);
                toast.success(res.data.message);
               
                if (setOtpSent) setOtpSent(false);
            }

        } 
           catch (error) {

                const status = error.response?.status;

            
                if (status === 429) {
                    toast.error("Too many attempts. Please request a new OTP.");
                    setOtpSent(false);
                    return;
                }

                   
                if (status === 400) {
                    toast.error("Invalid OTP. Try again.");
                    return;
                }

                toast.error("OTP verification failed");
            }

        finally {
            setIsVerifying(false);


        }
    };

    return { verifyOtp, isVerifying, isVerified, setIsVerified };

};

export default useVerifyOtp;
