import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import API from '../../Api/api';
import OtpInput from "react-otp-input";
import useSendOtp from '../../hooks/useSendOtp';
import useVerifyOtp from '../../hooks/useVerifyOtp';
import { useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [newpassword, setnewpassword] = useState("");
  const [otp, setOtp] = useState("")


  const { setOtpSent, sending, setSending, otpSent } = useSendOtp();
  const { verifyOtp, isVerifying, isVerified, setIsVerified } = useVerifyOtp();

  const mailchecker = async () => {
    try {

      setSending(true)
      const res = await API.post('/user/checkemailforreset', { email })
      if (res.data.success) {
        console.log(res.data.message); // OTP sent successfully
        toast.success(res.data.message)
        setOtpSent(true)

      }
      if (!res.data.success) {
        console.log(res.data.message) // User does not exits
        toast.error(res.data.message)

      }
    } catch (error) {

      const message =

        //   error = {
        //   response: {
        //      status: 429,
        //      data: {
        //         success:false,
        //         message:"Too many requests"
        //      }
        //   }
        // }

        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";

      toast.error(message);
      console.log(message);
    } finally {
      setSending(false);
    }
  }


  useEffect(() => {
    if (otp.length === 6) {
      console.log("Entered in otp length hook")
      verifyOtp(email, otp, setOtpSent);


    }
  }, [otp]);


  useEffect(() => {

    const checkEmailVerification = async () => {

      try {

        const savedEmail = sessionStorage.getItem("signupEmail");

        if (!savedEmail) return;

        const res = await API.post('/user/verifyemails', { email: savedEmail })

        if (res.data.success) {
          setEmail(savedEmail);
          setIsVerified(true);
          toast.success("Email verified Again")
        }

      } catch (error) {
        toast.error(error)
      }
    };

    checkEmailVerification();

  }, []);  // For checkEmail verificaiton from sessionstorage



  const resetpassword = async (e) => {
    e.preventDefault();
    try {

      console.log("Entered in resetpassword fronted")
      const res = await API.post('/user/reset-password', { email, newpassword })
      if (res.data.success) {
        console.log("success function of fronted")
        toast.success(res.data.message);
        navigate('/login')
      }
      else {
        toast.success(res.data.message)
      }


    } catch (error) {
      console.log(error)
    }

  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">


          <div className="w-full md:w-1/2 flex items-center justify-center p-8">
            <div className="w-full max-w-sm flex flex-col gap-6">


              <form
                onSubmit={resetpassword}
                className="flex flex-col gap-6"
              >


                <p className="text-sm text-gray-500 text-center font-bold">
                  Reset You Password
                </p>




                <div className='flex'>
                  <input
                    type="email"
                    placeholder="📧 Enter your email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 mr-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    value={email}
                    disabled={isVerified}
                    onChange={(e) => {
                      const value = e.target.value;
                      setEmail(e.target.value);
                      sessionStorage.setItem("signupEmail", value);
                    }}
                    required
                  />

                  {(isVerified || email === "") ? "" : (<button className='px-4 py-2 bg-blue-600  text-white rounded-lg whitespace-nowrap'
                    type='button'
                    disabled={sending}

                    onClick={() => mailchecker()}



                  >{sending ? "sending...." : "send OTP"}</button>)}



                </div>

                {isVerified ? (
                  <input
                    type="password"
                    placeholder="🔒 Set New password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    value={newpassword}
                    onChange={(e) => setnewpassword(e.target.value)}
                    required
                  />
                ) : ""}


                {isVerified ? (<button
                  type="submit"
                  className="w-full bg-gray-300 hover:bg-gray-800 text-black hover:text-white 
                   font-semibold py-3 rounded-lg transition duration-200"
                >
                  Reset Password
                </button>) : ""}
              </form>

              {otpSent && (
                <div className="flex flex-col items-center gap-4 border rounded-lg p-4">

                  <p className="text-sm font-medium text-gray-600">
                    Enter the 6-digit OTP sent to your email
                  </p>

                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    disabled={isVerifying}

                    containerStyle={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "12px",
                      width: "100%"
                    }}

                    inputStyle={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "10px",
                      border: "2px solid #9ca3af",
                      fontSize: "20px",
                      fontWeight: "600",
                      textAlign: "center"
                    }}

                    focusStyle={{
                      outline: "none",
                      border: "2px solid #f59e0b",
                      boxShadow: "0 0 0 2px rgba(245,158,11,0.3)"
                    }}

                    renderInput={(props) => <input {...props} />}
                  />


                </div>
              )}

            </div>
          </div>




        </div>
      </div>
    </>
  )
}

export default ForgetPassword
