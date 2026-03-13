import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useContext, useState } from "react";
import { AuthContext } from "../../Context/Authcontext";
import ProfileModal from "../../Pop-Up/ProfileModal";
import { User, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-10 sm:py-5 xl:px-32">
      <img
        src={assets.Postify}
        alt="logo"
        className="w-32 cursor-pointer object-contain sm:w-40 md:w-48"
        onClick={() => navigate("/")}
      />

      <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
        {!user && (
          <button
            onClick={() => navigate("/login")}
            aria-label="User Login"
            className="
              h-[51px] w-[131px] cursor-pointer place-items-center rounded-[15px]
              bg-[rgba(46,142,255,0.2)]
              bg-[linear-gradient(to_bottom_right,#2e8eff_0%,rgba(46,142,255,0)_30%)]
              transition duration-300
              hover:bg-[rgba(46,142,255,0.7)]
              hover:shadow-[0_0_10px_rgba(46,142,255,0.5)]
              focus:outline-none
              focus:bg-[rgba(46,142,255,0.7)]
              focus:shadow-[0_0_10px_rgba(46,142,255,0.5)]
              grid
            "
          >
            <span
              className="
                flex h-[47px] w-[127px] items-center justify-center gap-[15px]
                rounded-[13px] bg-[#1a1a1a] font-semibold text-white
              "
            >
              <User size={27} className="text-white" />
              Log In
            </span>
          </button>
        )}

        {user && (
          <>
            <button
              onClick={() => navigate("/admin")}
              aria-label="Dashboard"
              className="
                h-[51px] w-[131px] cursor-pointer place-items-center rounded-[15px]
                bg-[rgba(46,142,255,0.2)]
                bg-[linear-gradient(to_bottom_right,#2e8eff_0%,rgba(46,142,255,0)_30%)]
                transition duration-300
                hover:bg-[rgba(46,142,255,0.7)]
                hover:shadow-[0_0_10px_rgba(46,142,255,0.5)]
                focus:outline-none
                focus:bg-[rgba(46,142,255,0.7)]
                focus:shadow-[0_0_10px_rgba(46,142,255,0.5)]
                grid
              "
            >
              <span
                className="
                  flex h-[47px] w-[127px] items-center justify-center gap-[12px]
                  rounded-[13px] bg-[#1a1a1a] font-semibold text-white
                "
              >
                <LayoutDashboard size={24} className="text-white" />
                Dashboard
              </span>
            </button>

            <button
              onClick={() => setShowProfile(true)}
              aria-label="Profile"
              className="
                h-[51px] w-[131px] cursor-pointer place-items-center rounded-[15px]
                bg-[rgba(46,142,255,0.2)]
                bg-[linear-gradient(to_bottom_right,#2e8eff_0%,rgba(46,142,255,0)_30%)]
                transition duration-300
                hover:bg-[rgba(46,142,255,0.7)]
                hover:shadow-[0_0_10px_rgba(46,142,255,0.5)]
                focus:outline-none
                focus:bg-[rgba(46,142,255,0.7)]
                focus:shadow-[0_0_10px_rgba(46,142,255,0.5)]
                grid
              "
            >
              <span
                className="
                  flex h-[47px] w-[127px] items-center justify-center gap-[12px]
                  rounded-[13px] bg-[#1a1a1a] font-semibold text-white
                "
              >
                <User size={24} className="text-white" />
                Profile
              </span>
            </button>
            
          </>
        )}

        {showProfile && (
          <ProfileModal onClose={() => setShowProfile(false)} />
        )}
      </div>
    </div>
  );
};

export default Navbar;