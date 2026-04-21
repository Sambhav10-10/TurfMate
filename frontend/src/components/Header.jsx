import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Header = () => {
    const navigate = useNavigate()
    return (
        <div className='flex flex-col md:flex-row flex-wrap bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl px-6 md:px-10 lg:px-20 overflow-hidden shadow-lg'>

            {/* --------- Header Left --------- */}
            <div className='md:w-1/2 flex flex-col items-start justify-center gap-5 py-10 m-auto md:py-[10vw] md:mb-[-30px]'>
                <div>
                    <p className='text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight md:leading-tight lg:leading-tight'>
                        Find Turf <span className='text-blue-200'>Matches</span> <br /> & <span className='text-blue-200'>Join</span> Players
                    </p>
                </div>
                <div className='flex flex-col md:flex-row items-center gap-4 text-white text-sm font-light'>
                    <img className='w-32' src={assets.group_profiles} alt="Player profiles" />
                    <p className='text-base font-light'>Join or create matches to fill turf slots with ease.</p>
                </div>
                <button onClick={() => { navigate('/matches'); window.scrollTo(0, 0); }} className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-blue-700 font-bold text-sm m-auto md:m-0 hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-md'>
                    🎯 Browse Matches <img className='w-3' src={assets.arrow_icon} alt="" />
                </button>
            </div>

            {/* --------- Header Right --------- */}
            <div className='md:w-1/2 relative flex items-center justify-center'>
                <img className='w-4/5 h-auto rounded-lg img-hero' loading="lazy" width="900" height="500" src={assets.header_img} alt="Find Turf Matches" />
            </div>
        </div>
    )
}

export default Header