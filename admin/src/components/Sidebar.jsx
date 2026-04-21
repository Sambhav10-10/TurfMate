import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'

const Sidebar = () => {

  const { aToken } = useContext(AdminContext)

  return (
    <div className='min-h-screen bg-white border-r'>
      {aToken && <ul className='text-[#515151] mt-5'>

        <NavLink to={'/admin-dashboard'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
          <img className='min-w-5' src={assets.home_icon} alt='' />
          <p className='hidden md:block'>Dashboard</p>
        </NavLink>
        <NavLink to={'/matches'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
          <img className='min-w-5' src={assets.match_icon} alt='' />
          <p className='hidden md:block'>Matches</p>
        </NavLink>
        <NavLink to={'/payments'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
          <img className='min-w-5' src={assets.earnings_icon} alt='' />
          <p className='hidden md:block'>Payments</p>
        </NavLink>
        <NavLink to={'/process-revenue'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
          <span className='min-w-5 text-sm font-bold text-gray-700'>%</span>
          <p className='hidden md:block'>Revenue Split</p>
        </NavLink>
        <NavLink to={'/verify-turfs'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
          <span className='min-w-5 text-sm font-bold text-gray-700'>✓</span>
          <p className='hidden md:block'>Verify Turfs</p>
        </NavLink>
        <NavLink to={'/wallet'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
          <span className='min-w-5 text-sm font-bold text-gray-700'>$</span>
          <p className='hidden md:block'>Wallet</p>
        </NavLink>
      </ul>}

    </div>
  )
}

export default Sidebar