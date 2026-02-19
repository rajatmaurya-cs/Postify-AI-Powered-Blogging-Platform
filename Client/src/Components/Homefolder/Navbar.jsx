import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../Context/Authcontext";
import ProfileModal from "../../Pop-Up/ProfileModal";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="flex flex-wrap justify-between items-center py-3 px-4 sm:py-5 sm:px-10 xl:px-32 gap-3">
     
      <img
        src={assets.Postify}
        alt="logo"
        className="object-contain cursor-pointer w-32 sm:w-40 md:w-48"
        onClick={() => navigate("/")}
      />

    
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
        {!user && (
          <>
            <button
              onClick={() => navigate("/login")}
              className="group p-[3px] sm:p-[4px] rounded-[12px] bg-gradient-to-b from-white to-stone-200/40 
              shadow-[0_1px_3px_rgba(0,0,0,0.5)] 
              active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] 
              active:scale-[0.995]"
            >
              <div className="bg-gradient-to-b from-stone-200/40 to-white/80 rounded-[8px] px-3 py-1.5 sm:px-4 sm:py-2">
                <span className="font-semibold text-sm sm:text-base">Login</span>
              </div>
            </button>
          </>
        )}

        {user?.role === "ADMIN" && (
          <button
            onClick={() => navigate("/admin")}
            className="group p-2 sm:p-3 rounded-[16px] sm:rounded-[20px] bg-gradient-to-b from-white to-stone-200/40 
            shadow-[0_1px_3px_rgba(0,0,0,0.5)] 
            active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] 
            active:scale-[0.995] font-bold text-sm sm:text-base"
          >
            Dashboard
          </button>
        )}

        {user && user.role !== "ADMIN" && (
          <button
            onClick={() => setShowProfile(true)}
            className="group p-2 sm:p-4 rounded-full bg-gradient-to-b from-white to-stone-200/40 
            shadow-[0_1px_3px_rgba(0,0,0,0.5)] 
            active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] 
            active:scale-[0.995] text-sm sm:text-base"
          >
            Profile
          </button>
        )}

        {showProfile && (
          <ProfileModal onClose={() => setShowProfile(false)} />
        )}
      </div>
    </div>
  );
};

export default Navbar;
