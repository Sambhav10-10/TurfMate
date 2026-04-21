import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'

const OwnerSidebar = () => {

    const { aToken } = useContext(AdminContext)

    return (
        <div className='min-h-screen bg-white border-r'>
            {aToken && <ul className='text-[#515151] mt-5'>

                <NavLink to={'/owner'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
                    <span className='min-w-5 text-sm font-bold text-gray-700'>D</span>
                    <p className='hidden md:block'>Dashboard</p>
                </NavLink>

                <NavLink to={'/owner/turfs'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
                    <span className='min-w-5 text-sm font-bold text-gray-700'>P</span>
                    <p className='hidden md:block'>My Turfs</p>
                </NavLink>

                <NavLink to={'/owner/matches'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
                    <span className='min-w-5 text-sm font-bold text-gray-700'>M</span>
                    <p className='hidden md:block'>Matches</p>
                </NavLink>

                <NavLink to={'/owner/earnings'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
                    <span className='min-w-5 text-sm font-bold text-gray-700'>₹</span>
                    <p className='hidden md:block'>Earnings</p>
                </NavLink>

            </ul>}

        </div>
    )
}

export default OwnerSidebar
