import React from "react";
import { useContext } from "react";
import { AuthContext } from '../Context/Authcontext'
import { assets } from "../assets/assets";
const ProfileModal = ({  onClose }) => {
   
    const { logout , user , isLoggingOut} = useContext(AuthContext)
    

    const handlelogout = ()=>{
        try{
            onClose
            logout()

        }
        catch(error){
            console.log(error)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="relative bg-white w-[380px] rounded-2xl shadow-2xl p-6">

                
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
                >
                    ✕
                </button>
               

                
                <div className="flex flex-col items-center text-center gap-4 mt-4">

              
                    <div className="p-1 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500">
                        <img
                            src={user?.avatar || assets.user_icon}
                            alt="avatar"
                            className="w-28 h-28 rounded-full object-cover bg-white"
                        />
                      

                    </div>

                    
                    <h2 className="text-2xl font-bold text-gray-800">
                        {user?.name}
                    </h2>

                    
                    <p className="text-sm text-gray-500 text-black flex">
                        {user?.email}

                    </p>


                    <p>
                        Joined on{" "}
                        {new Date(user?.createdAt,).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                    </p>



                    
                    <div className="w-full h-px bg-gray-200 my-4" />

                    
                    <div className="flex gap-3 w-full">

                        <button
                            onClick={() => handlelogout()}

                            className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition">

                           {isLoggingOut ? "Loggingout..." :" Logout"}
                        </button>
                    </div>

                </div>
            </div>
        </div>

    );
};

export default ProfileModal;
