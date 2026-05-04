import HeaderButton from '../../Effects/HeaderButton'

const Header = () => {
    return (
        <div className='relative overflow-hidden bg-[#fafbfc] pt-32 pb-20 sm:pt-40 sm:pb-24 flex items-center justify-center font-sans'>
            <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/50 via-white to-white pointer-events-none opacity-80 z-0'></div>
            
            <div className='relative z-10 text-center max-w-4xl mx-auto px-6 animate-in fade-in slide-in-from-bottom-8 duration-700'>
                <div className='inline-flex items-center justify-center mb-8 transform hover:scale-105 transition-transform duration-300'>
                    <HeaderButton />
                </div>

                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-gray-900 mb-6 drop-shadow-sm font-[family-name:var(--font-display)]">
                    Too long? Click <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)]">AI Summariser</span>
                </h1>
                
                <p className="text-lg sm:text-xl text-gray-500 font-normal tracking-normal max-w-2xl mx-auto leading-relaxed">
                    Get the core idea instantly. Move on to what matters next.
                </p>
            </div>
            
            <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fafbfc] to-transparent pointer-events-none'></div>
        </div>
    )
}

export default Header
