
import FrontButton from '../../Effects/FrontButton'
import Gpt from '../../Effects/Gpt'

const Header = () => {


    return (

        <div className='mx-8 sm:mx-16 xl:mx-24 relative'>

            <div className='text-center mt-20 mb-8'>

                <div className='inline-flex items-center justify-center gap-4 px-6 py-1.5 mb-4'>

                    <div><Gpt /></div>

                </div>

                <h1 className="text-3xl sm:text-6xl font-semibold sm:leading-tight text-gray-700">
                    Too long? Click <span className="text-primary">AI Summariser</span> <br />
                    Get the idea. Move on.
                </h1>



            </div>


            <div
                className='fixed inset-0 -z-10 bg-center bg-gray-300'
            />

        </div>

    )
}

export default Header
