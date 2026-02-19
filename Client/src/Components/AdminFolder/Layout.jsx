import React from 'react'
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
        <>
            <div className='flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200'>
                <img
                    src={assets.Postify}
                    alt="logo"
                    className="object-contain cursor-pointer w-32 sm:w-40 md:w-48"
                    onClick={() => navigate("/")}
                />
                <button
                    onClick={() => handlelogout()}
                    disabled={isLoggingOut}
                    className='text-sm px-8 py-2 bg-primary text-white rounded-full cursor-pointer'>
                    {isLoggingOut ? "Logging out..." : " Logout"}</button>

            </div>
            <div className='flex h-[calc(100vh-70px)]'>
                <Sidebar />
                <Outlet />
            </div>


        </>
    )
}

export default Layout
