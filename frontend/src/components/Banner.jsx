import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {

    const navigate = useNavigate()

    return (
        <div className='flex bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10 shadow-lg overflow-hidden'>

            {/* ------- Left Side ------- */}
            <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
                <div className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white'>
                    <p className='mb-2'>Find Your Turf Match</p>
                    <p className='text-blue-100 text-lg md:text-2xl font-normal'>Gather players and fill slots easily</p>
                </div>
                <button onClick={() => { navigate('/login'); scrollTo(0, 0) }} className='bg-white text-sm sm:text-base text-blue-700 font-bold px-8 py-3 rounded-full mt-8 hover:bg-gray-100 hover:scale-105 transition-all shadow-md'>
                    Get Started
                </button>
            </div>

            {/* ------- Right Side ------- */}
            <div className='hidden md:flex md:w-1/2 lg:w-[370px] relative items-center justify-center'>
                <img className='w-4/5 max-w-md h-auto' src={assets.appointment_img} alt="Get started with matches" />
            </div>
        </div>
    )
}

export default Banner