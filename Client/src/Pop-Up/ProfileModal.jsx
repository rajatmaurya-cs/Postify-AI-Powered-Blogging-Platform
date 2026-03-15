import { useContext } from "react";
import { AuthContext } from '../Context/Authcontext'
import { assets } from "../assets/assets";
import Swal from "sweetalert2";
const ProfileModal = ({ onClose }) => {

    const { logout, user, isLoggingOut } = useContext(AuthContext)


    const handlelogout = async () => {
        try {
            const result = await Swal.fire({
                title: "Logout?",
                text: "Are you sure you want to logout?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, logout",
                cancelButtonText: "Cancel",
            });

            if (result.isConfirmed) {
                onClose();
                logout();
            }
        } catch (error) {
            console.log(error);
        }
    };


    return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[100] animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm">
        
        {/* Close Button placed outside the main card padding but inside the relative container so it stays top-right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-colors shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] p-8 border border-white/40 transform transition-all animate-in zoom-in-95 duration-500">
          
          <div className="flex flex-col items-center text-center mt-4">
            <div className="relative group mb-6">
              <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-70 group-hover:opacity-100 blur transition duration-500"></div>
              <div className="relative p-1 rounded-full bg-white">
                <img
                  src={user?.avatar || assets.user_icon}
                  alt="avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-inner"
                />
              </div>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-1">
              {user?.name}
            </h2>

            <p className="text-sm font-medium text-gray-500 mb-6 bg-gray-50 px-4 py-1.5 rounded-full inline-flex border border-gray-100">
              {user?.email}
            </p>

            <div className="w-full bg-gray-50/80 rounded-2xl p-4 border border-gray-100 mb-8">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Member Since</p>
              <p className="text-sm font-medium text-gray-700">
                {new Date(user?.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="w-full">
              <button
                onClick={() => handlelogout()}
                disabled={isLoggingOut}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-semibold tracking-wide hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {isLoggingOut ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Logging out...
                  </span>
                ) : (
                  "Sign Out"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
};
export default ProfileModal;
