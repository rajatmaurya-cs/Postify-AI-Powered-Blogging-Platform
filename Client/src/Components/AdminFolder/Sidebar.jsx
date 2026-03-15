import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'
const Sidebar = () => {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-gray-100/80 bg-transparent min-h-full py-8 pr-6 hidden md:block">
      <nav className="space-y-2 sticky top-32">
        <NavLink 
          end={true} 
          to='/admin' 
          className={({ isActive }) => `group flex items-center gap-4 px-5 py-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${isActive ? "bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 font-bold text-indigo-600" : "text-gray-500 hover:bg-white hover:border-gray-100 hover:border hover:text-gray-900 border border-transparent font-medium"}`}
        >
          {({ isActive }) => (
            <>
              <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-indigo-50" : "bg-gray-50 group-hover:bg-gray-100"}`}>
                <img src={assets.home_icon} className={`w-5 h-5 object-contain transition-all ${isActive ? "brightness-0 saturate-100 filter-[invert(32%)_sepia(97%)_saturate(2959%)_hue-rotate(231deg)_brightness(94%)_contrast(99%)]" : "opacity-60 group-hover:opacity-100"}`} alt="" />
              </div>
              <p className="tracking-wide">Dashboard</p>
            </>
          )}
        </NavLink>

        <NavLink 
          to='/admin/addblog' 
          className={({ isActive }) => `group flex items-center gap-4 px-5 py-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${isActive ? "bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 font-bold text-indigo-600" : "text-gray-500 hover:bg-white hover:border-gray-100 hover:border hover:text-gray-900 border border-transparent font-medium"}`}
        >
          {({ isActive }) => (
            <>
              <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-indigo-50" : "bg-gray-50 group-hover:bg-gray-100"}`}>
                <img src={assets.add_icon} className={`w-5 h-5 object-contain transition-all ${isActive ? "brightness-0 saturate-100 filter-[invert(32%)_sepia(97%)_saturate(2959%)_hue-rotate(231deg)_brightness(94%)_contrast(99%)]" : "opacity-60 group-hover:opacity-100"}`} alt="" />
              </div>
              <p className="tracking-wide">Write Story</p>
            </>
          )}
        </NavLink>

        <NavLink 
          to='/admin/listBlog' 
          className={({ isActive }) => `group flex items-center gap-4 px-5 py-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${isActive ? "bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 font-bold text-indigo-600" : "text-gray-500 hover:bg-white hover:border-gray-100 hover:border hover:text-gray-900 border border-transparent font-medium"}`}
        >
          {({ isActive }) => (
            <>
              <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-indigo-50" : "bg-gray-50 group-hover:bg-gray-100"}`}>
                <img src={assets.list_icon} className={`w-5 h-5 object-contain transition-all ${isActive ? "brightness-0 saturate-100 filter-[invert(32%)_sepia(97%)_saturate(2959%)_hue-rotate(231deg)_brightness(94%)_contrast(99%)]" : "opacity-60 group-hover:opacity-100"}`} alt="" />
              </div>
              <p className="tracking-wide">Publications</p>
            </>
          )}
        </NavLink>

        <NavLink 
          to='/admin/Comments' 
          className={({ isActive }) => `group flex items-center gap-4 px-5 py-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${isActive ? "bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 font-bold text-indigo-600" : "text-gray-500 hover:bg-white hover:border-gray-100 hover:border hover:text-gray-900 border border-transparent font-medium"}`}
        >
          {({ isActive }) => (
            <>
              <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-indigo-50" : "bg-gray-50 group-hover:bg-gray-100"}`}>
                <img src={assets.comment_icon} className={`w-5 h-5 object-contain transition-all ${isActive ? "brightness-0 saturate-100 filter-[invert(32%)_sepia(97%)_saturate(2959%)_hue-rotate(231deg)_brightness(94%)_contrast(99%)]" : "opacity-60 group-hover:opacity-100"}`} alt="" />
              </div>
              <p className="tracking-wide">Discussions</p>
            </>
          )}
        </NavLink>

        <div className="pt-6 pb-2">
          <p className="px-5 text-xs font-bold tracking-widest text-gray-400 uppercase">Intelligence</p>
        </div>

        <NavLink 
          to='/admin/AI' 
          className={({ isActive }) => `group flex items-center gap-4 px-5 py-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${isActive ? "bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 font-bold text-indigo-600" : "text-gray-500 hover:bg-white hover:border-gray-100 hover:border hover:text-gray-900 border border-transparent font-medium"}`}
        >
          {({ isActive }) => (
            <>
              <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-indigo-50" : "bg-gray-50 group-hover:bg-gray-100"}`}>
                <img src={assets.AI} className={`w-5 h-5 object-contain transition-all ${isActive ? "brightness-0 saturate-100 filter-[invert(32%)_sepia(97%)_saturate(2959%)_hue-rotate(231deg)_brightness(94%)_contrast(99%)]" : "opacity-60 group-hover:opacity-100"}`} alt="" />
              </div>
              <p className="tracking-wide">AI Engine</p>
            </>
          )}
        </NavLink>

        <NavLink 
          to='/admin/AIsetting' 
          className={({ isActive }) => `group flex items-center gap-4 px-5 py-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${isActive ? "bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 font-bold text-indigo-600" : "text-gray-500 hover:bg-white hover:border-gray-100 hover:border hover:text-gray-900 border border-transparent font-medium"}`}
        >
          {({ isActive }) => (
            <>
              <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-indigo-50" : "bg-gray-50 group-hover:bg-gray-100"}`}>
                <img src={assets.setting} className={`w-5 h-5 object-contain transition-all ${isActive ? "brightness-0 saturate-100 filter-[invert(32%)_sepia(97%)_saturate(2959%)_hue-rotate(231deg)_brightness(94%)_contrast(99%)]" : "opacity-60 group-hover:opacity-100"}`} alt="" />
              </div>
              <p className="tracking-wide">Settings</p>
            </>
          )}
        </NavLink>
      </nav>
    </aside>
  );
};
export default Sidebar;
