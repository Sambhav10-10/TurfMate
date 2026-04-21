import React, { useContext, useState } from 'react'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const OwnerNavbar = () => {

    const { adminData, setAToken, setUserRole, setAdminData } = useContext(AdminContext)
    const navigate = useNavigate()
    const [showProfileMenu, setShowProfileMenu] = useState(false)

    const logout = () => {
        setAToken('')
        setUserRole('admin')
        setAdminData(null)
        localStorage.removeItem('aToken')
        localStorage.removeItem('userRole')
        localStorage.removeItem('adminData')
        navigate('/login')
    }

    return (
        <div className='flex items-center justify-between bg-white px-8 py-4 border-b'>
            <div className='flex items-center gap-2'>
                <span className='text-2xl font-bold text-primary'>TurfMate</span>
                <p className='font-bold text-xl text-gray-900'>Turf Owner Portal</p>
            </div>

            <div className='flex items-center gap-4 relative'>
                {/* Profile Dropdown Button */}
                <div className='relative'>
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className='flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition'
                    >
                        <div className='text-right hidden sm:block'>
                            <p className='text-gray-900 font-semibold text-sm'>{adminData?.name}</p>
                            <p className='text-gray-600 text-xs'>Owner</p>
                        </div>
                        <img className='w-10 h-10 rounded-full cursor-pointer' src={adminData?.image} alt={adminData?.name} />
                    </button>

                    {/* Dropdown Menu */}
                    {showProfileMenu && (
                        <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50'>
                            <div className='p-4 border-b bg-gray-50'>
                                <p className='font-semibold text-gray-900'>{adminData?.name}</p>
                                <p className='text-sm text-gray-600'>{adminData?.email}</p>
                            </div>
                            <button
                                onClick={() => {
                                    navigate('/owner/profile')
                                    setShowProfileMenu(false)
                                }}
                                className='w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 transition'
                            >
                                👤 View Profile
                            </button>
                            <button
                                onClick={() => {
                                    logout()
                                    setShowProfileMenu(false)
                                }}
                                className='w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition border-t'
                            >
                                🚪 Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default OwnerNavbar
