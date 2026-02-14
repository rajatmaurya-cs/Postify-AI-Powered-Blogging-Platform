import React, { useState, useEffect } from 'react'
import API from '../../Api/api'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import OtpInput from "react-otp-input";
import useGoogleAuth from "../../hooks/useGoogleAuth";
import toast from 'react-hot-toast'
import useSendOtp from '../../hooks/useSendOtp';
import useVerifyOtp from '../../hooks/useVerifyOtp';


const Signup = () => {
    const [fullName, setFullname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [otp, setOtp] = useState("");


    const { sendOtp, setOtpSent, sending, otpSent } = useSendOtp();
    const { verifyOtp, isVerifying, isVerified, setIsVerified } = useVerifyOtp();
    const googleLogin = useGoogleAuth();

    const Navigate = useNavigate()


    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            console.log("Entered in handleSignup of fronted")
            const res = await API.post('/auth/signup', {
                fullName,
                email,
                password
            });

            if (res.data.success) {
                toast.success(res.data.message)
                Navigate('/login')
            } else {
                toast.success(res.data.message)
            }

        } catch (error) {
            console.log(error.response?.data?.message || error.message);
        }
    };

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

                const res = await API.post('/auth/verifyemail', { email: savedEmail })

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

    }, []); 




    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">


                    <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                        <div className="w-full max-w-sm flex flex-col gap-6">


                            <form
                                onSubmit={handleSignup}
                                className="flex flex-col gap-6"
                            >


                                <p className="text-sm text-gray-500 text-center font-bold">
                                    Signup to continue to your AI Blog
                                </p>

                                {isVerified ? (<input
                                    type="text"
                                    placeholder="Enter Your Name"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                    value={fullName}
                                    onChange={(e) => setFullname(e.target.value)}
                                    required
                                />) : ""}


                                <div className='flex'>
                                    <input
                                        type="email"
                                        placeholder="📧 Enter your email"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 mr-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                        value={email}
                                        disabled={isVerified}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setEmail(value);
                                            sessionStorage.setItem("signupEmail", value);
                                        }}
                                        required
                                    />

                                    {(isVerified || email === "") ? "" : (<button className='px-4 py-2 bg-blue-600  text-white rounded-lg whitespace-nowrap'
                                        type='button'
                                        disabled={sending}

                                        onClick={() => sendOtp(email)}



                                    >{sending ? "sending...." : "send OTP"}</button>)}



                                </div>
                                {isVerified ? (
                                    <input
                                        type="password"
                                        placeholder="🔒 Set password"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                ) : ""}


                                {isVerified ? (<button
                                    type="submit"
                                    className="w-full bg-gray-300 hover:bg-gray-800 text-black hover:text-white 
                   font-semibold py-3 rounded-lg transition duration-200"
                                >
                                    signup
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





                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-gray-300" />
                                <span className="text-sm text-gray-500">OR</span>
                                <div className="flex-1 h-px bg-gray-300" />
                            </div>


                            <button
                                type="button"
                                onClick={googleLogin}
                                className="w-full bg-white border border-gray-300 hover:bg-gray-100 
                 text-gray-700 font-semibold py-3 rounded-lg transition duration-200 
                 flex items-center justify-center gap-3"
                            >
                                <img
                                    src={assets.google}
                                    alt="Google"
                                    className="w-5 h-5 object-contain"
                                    onClick={() => googleLogin}
                                />
                                <span>Signup with Google</span>
                            </button>

                            <p className="text-xs text-center text-gray-500">
                                Powered by AI ✨
                            </p>

                        </div>
                    </div>




                </div>
            </div>
        </>
    )
}

export default Signup
