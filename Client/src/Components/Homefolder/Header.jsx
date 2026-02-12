import React, { useRef } from 'react'

import FrontButton from '../../Effects/frontButton'
import Gpt from '../../Effects/Gpt'

const Header = () => {


    return (

        <div className='mx-8 sm:mx-16 xl:mx-24 relative'>

            <div className='text-center mt-20 mb-8'>

                <div className='inline-flex items-center justify-center gap-4 px-6 py-1.5 mb-4'>
                   
                    <div><Gpt /></div>

                </div>
                
                <h1 className='text-3xl sm:text-6xl font-semibold sm:leading-16 text-gray-700'>Build Your <span className='text-primary'>Voice</span> <br />On Internet</h1>


            </div>
           
          
            <div
                className='fixed inset-0 -z-10 bg-center bg-gray-300'
            />

        </div>

    )
}

export default Header
