import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

  const { aToken, setAToken, setUserRole, setAdminData } = useContext(AdminContext)

  const navigate = useNavigate()

  const logout = () => {
    navigate('/')
    setAToken('')
    setUserRole('admin')
    setAdminData(null)
    localStorage.removeItem('aToken')
    localStorage.removeItem('userRole')
    localStorage.removeItem('adminData')
  }

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center gap-2 text-xs'>
        <img onClick={() => navigate('/')} className='w-28 sm:w-32 cursor-pointer img-logo' loading="lazy" width="128" height="43" src={assets.admin_logo} alt="Admin Logo" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>Admin</p>
      </div>
      <button onClick={() => logout()} className='bg-primary text-white text-sm px-10 py-2 rounded-full'>Logout</button>
    </div>
  )
}

export default Navbar