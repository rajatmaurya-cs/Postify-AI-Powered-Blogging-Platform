
import { assets } from '../../assets/assets'
import { useNavigate, Outlet } from 'react-router-dom'
import Sidebar from './Sidebar';
import { useContext } from "react";
import { AuthContext } from '../../Context/Authcontext'
import Swal from "sweetalert2";

const Layout = () => {

    const navigate = useNavigate();
    const { logout, isLoggingOut } = useContext(AuthContext)


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

                logout();
            }
        } catch (error) {
            console.log(error);
        }
    };


  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all">
        <div className="flex items-center justify-between h-[70px] px-6 sm:px-10 max-w-7xl mx-auto w-full">
          <img
            src={assets.Postify}
            alt="logo"
            className="object-contain cursor-pointer h-8 sm:h-9 hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          />

          <button
            onClick={() => handlelogout()}
            disabled={isLoggingOut}
            className="group relative inline-flex items-center justify-center gap-2 px-6 py-2 bg-gray-900 text-white text-sm font-bold tracking-wide rounded-full overflow-hidden transition-all hover:shadow-[0_4px_15px_rgb(0,0,0,0.12)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
            {isLoggingOut ? (
              <span className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Signing out...
              </span>
            ) : (
              <span className="relative z-10">Sign Out</span>
            )}
          </button>
        </div>
      </header>

      {/* Demo Warning Banner */}
      <div className="bg-amber-50/80 border-b border-amber-100/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-center gap-2">
          <span className="text-amber-500 text-sm">✦</span>
          <p className="text-xs sm:text-sm font-medium text-amber-700/90 tracking-wide text-center">
            Admin panel is visible for demonstration. Editing actions are restricted.
          </p>
        </div>
      </div>

      <div className="flex flex-1 max-w-7xl mx-auto w-full relative">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="relative flex-1 overflow-x-hidden p-6 sm:p-10 w-full">
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-100/80 min-h-[calc(100vh-200px)] relative overflow-hidden h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
