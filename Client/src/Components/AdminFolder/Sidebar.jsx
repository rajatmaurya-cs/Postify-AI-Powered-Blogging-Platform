import React from 'react'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'
const Sidebar = () => {
  return (
    <div className='flex flex-col border-r border-gray-200 min-h-full pt-6 '>
      <NavLink end={true} to='/admin' className={({ isActive }) => `flex items-center gap-3 py-3.5 md:px-9 md:min-w-64 cursor-pointer ${isActive && "bg-primary/10 border-r-4 border-primary"}`}>
        <img src={assets.home_icon} className='min-w-4 w-5' alt="" />
        <p className='hidden md:inline-block'>Dashboard</p>
      </NavLink>

      <NavLink to='/admin/addblog' className={({ isActive }) => `flex items-center gap-3 py-3.5 md:px-9 md:min-w-64 cursor-pointer ${isActive && "bg-primary/10 border-r-4 border-primary"}`}>
        <img src={assets.add_icon} className='min-w-4 w-5' alt="" />
        <p className='hidden md:inline-block'>AddBlog</p>
      </NavLink>

      <NavLink to='/admin/listBlog' className={({ isActive }) => `flex items-center gap-3 py-3.5 md:px-9 md:min-w-64 cursor-pointer ${isActive && "bg-primary/10 border-r-4 border-primary"}`}>
        <img src={assets.list_icon} className='min-w-4 w-5' alt="" />
        <p className='hidden md:inline-block'>Blog List</p>
      </NavLink>

      <NavLink to='/admin/Comments' className={({ isActive }) => `flex items-center gap-3 py-3.5 md:px-9 md:min-w-64 cursor-pointer ${isActive && "bg-primary/10 border-r-4 border-primary"}`}>
        <img src={assets.comment_icon} className='min-w-4 w-5' alt="" />
        <p className='hidden md:inline-block'>Comments</p>
      </NavLink>

      <NavLink to='/admin/AI' className={({ isActive }) => `flex items-center gap-3 py-3.5 md:px-9 md:min-w-64 cursor-pointer ${isActive && "bg-primary/10 border-r-4 border-primary"}`}>
        <img src={assets.AI} className='min-w-4 w-5' alt="" />
        <p className='hidden md:inline-block'>Ai Activities</p>
      </NavLink>


      <NavLink to='/admin/AIsetting' className={({ isActive }) => `flex items-center gap-3 py-3.5 md:px-9 md:min-w-64 cursor-pointer ${isActive && "bg-primary/10 border-r-4 border-primary"}`}>
        <img src={assets.setting} className='min-w-4 w-5' alt="" />
        <p className='hidden md:inline-block'>Ai Config</p>
      </NavLink>





    </div>
  )
}

export default Sidebar
