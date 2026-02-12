import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../Context/Authcontext";
import ProfileModal from "../../Pop-Up/ProfileModal"

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);



  return (
    <div className="flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32">

      <img
        src={assets.Postify2}
        alt="logo"
        className="object-contain cursor-pointer w-50"
        onClick={() => navigate("/")}
      />

      <div>
        {!user && (
          <div className="space-x-2">

            <button
              onClick={() => navigate('/login')}
              className="group p-[4px] rounded-[12px] bg-gradient-to-b from-white to-stone-200/40 
               shadow-[0_1px_3px_rgba(0,0,0,0.5)] 
               active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] 
               active:scale-[0.995]"
            >
              <div className="bg-gradient-to-b from-stone-200/40 to-white/80 rounded-[8px] px-4 py-2">
                <span className="font-semibold">Login</span>
              </div>
            </button>

            <button
              onClick={() => navigate('/SignUp')}
              className="group p-[4px] rounded-[12px] bg-gradient-to-b from-white to-stone-200/40 
               shadow-[0_1px_3px_rgba(0,0,0,0.5)] 
               active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] 
               active:scale-[0.995]"
            >

              <div className="bg-gradient-to-b from-stone-200/40 to-white/80 rounded-[8px] px-4 py-2">
                <span className="font-semibold">SignUp</span>
              </div>
            </button>
          </div>
        )}

        {user?.role === "ADMIN" && (
          <button
            onClick={() => navigate("/admin")}
             className="group p-[10px] rounded-[20px] bg-gradient-to-b from-white to-stone-200/40 
               shadow-[0_1px_3px_rgba(0,0,0,0.5)] 
               active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] 
               active:scale-[0.995] font-bold"
            >
            Dashboard
          </button>
        )}

        {user && user.role !== "ADMIN" && (
          <button
            onClick={() => setShowProfile(true)}   
            className="group p-5 rounded-4xl bg-gradient-to-b from-white to-stone-200/40 
               shadow-[0_1px_3px_rgba(0,0,0,0.5)] 
               active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] 
               active:scale-[0.995]"
          >
            Profile
          </button>
        )}
        {showProfile && (
          <ProfileModal
            // user={user}
            onClose={() => setShowProfile(false)}
          />
        )}


      </div>
    </div>
  );
};

export default Navbar;
