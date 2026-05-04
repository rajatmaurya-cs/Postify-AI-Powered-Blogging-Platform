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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        
        <div className="flex-shrink-0 cursor-pointer transform transition-transform duration-300 hover:scale-[1.02]" onClick={() => navigate("/")}>
          <img
            src={assets.Postify}
            alt="logo"
            className="h-9 w-auto object-contain"
          />
        </div>

        <div className="flex items-center gap-4">
          {!user ? (
              <button
              onClick={() => navigate("/login")}
              className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 text-white font-medium rounded-full overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-0.5"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <User size={18} className="text-white relative z-10" />
              <span className="relative z-10 tracking-normal text-sm">Sign In</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/admin")}
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors border border-gray-200/60"
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setShowProfile(true)}
                className="relative inline-flex items-center justify-center gap-2 pl-2 pr-5 py-1.5 bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md rounded-full transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px]">
                  <img src={user?.avatar || assets.user_icon} className="w-full h-full rounded-full border-2 border-white object-cover" alt="Profile" />
                </div>
                <span className="text-sm font-semibold text-gray-800 tracking-tight">{user.name?.split(' ')[0] || 'Profile'}</span>
              </button>
            </>
          )}

          {showProfile && (
            <ProfileModal onClose={() => setShowProfile(false)} />
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
