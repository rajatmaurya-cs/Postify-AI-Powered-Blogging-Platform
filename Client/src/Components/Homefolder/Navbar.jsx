import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useContext, useState } from "react";
import { AuthContext } from "../../Context/Authcontext";
import ProfileModal from "../../Pop-Up/ProfileModal";
import { User } from "lucide-react";
import { LayoutDashboard } from "lucide-react";

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
              aria-label="User Login"
              className="
        w-[131px] h-[51px] rounded-[15px]
        grid place-items-center cursor-pointer
        bg-[linear-gradient(to_bottom_right,#2e8eff_0%,rgba(46,142,255,0)_30%)]
        bg-[rgba(46,142,255,0.2)]
        transition duration-300
        hover:bg-[rgba(46,142,255,0.7)]
        hover:shadow-[0_0_10px_rgba(46,142,255,0.5)]
        focus:outline-none focus:bg-[rgba(46,142,255,0.7)]
        focus:shadow-[0_0_10px_rgba(46,142,255,0.5)]
      "
            >
              <span
                className="
          w-[127px] h-[47px] rounded-[13px]
          bg-[#1a1a1a]
          flex items-center justify-center gap-[15px]
          text-white font-semibold
        "
              >
                <User size={27} className="text-white" />
                Log In
              </span>

            </button>
          </>
        )}

        {user?.role === "ADMIN" && (
          <button
            onClick={() => navigate('/admin')}
            aria-label="User Login"
            className="
        w-[131px] h-[51px] rounded-[15px]
        grid place-items-center cursor-pointer
        bg-[linear-gradient(to_bottom_right,#2e8eff_0%,rgba(46,142,255,0)_30%)]
        bg-[rgba(46,142,255,0.2)]
        transition duration-300
        hover:bg-[rgba(46,142,255,0.7)]
        hover:shadow-[0_0_10px_rgba(46,142,255,0.5)]
        focus:outline-none focus:bg-[rgba(46,142,255,0.7)]
        focus:shadow-[0_0_10px_rgba(46,142,255,0.5)]
      "
          >
            <span
              className="
          w-[127px] h-[47px] rounded-[13px]
          bg-[#1a1a1a]
          flex items-center justify-center gap-[15px]
          text-white font-semibold
        "
            >
              <LayoutDashboard size={27} className="text-white" />
              →


            </span>
          </button>
        )}


        {user && user.role !== "ADMIN" && (
          <button
            onClick={() => setShowProfile(true)}
            aria-label="User Login"
            className="
        w-[131px] h-[51px] rounded-[15px]
        grid place-items-center cursor-pointer
        bg-[linear-gradient(to_bottom_right,#2e8eff_0%,rgba(46,142,255,0)_30%)]
        bg-[rgba(46,142,255,0.2)]
        transition duration-300
        hover:bg-[rgba(46,142,255,0.7)]
        hover:shadow-[0_0_10px_rgba(46,142,255,0.5)]
        focus:outline-none focus:bg-[rgba(46,142,255,0.7)]
        focus:shadow-[0_0_10px_rgba(46,142,255,0.5)]
      "
          >
            <span
              className="
          w-[127px] h-[47px] rounded-[13px]
          bg-[#1a1a1a]
          flex items-center justify-center gap-[15px]
          text-white font-semibold
        "
            >
              <User size={27} className="text-white" />

            </span>
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
