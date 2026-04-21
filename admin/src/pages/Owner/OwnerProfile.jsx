import { useState, useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'

const OwnerProfile = () => {
    const { adminData, setAToken, setUserRole, setAdminData } = useContext(AdminContext)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: adminData?.name || '',
        email: adminData?.email || '',
        phone: adminData?.phone || '',
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleLogout = () => {
        setAToken('')
        setUserRole('admin')
        setAdminData(null)
        localStorage.removeItem('aToken')
        localStorage.removeItem('userRole')
        localStorage.removeItem('adminData')
        window.location.href = '/login'
    }

    return (
        <div className='min-h-screen bg-gray-50 py-12 px-4'>
            <div className='max-w-md mx-auto'>
                {/* Profile Card */}
                <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
                    {/* Header */}
                    <div className='bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white text-center'>
                        <img
                            src={adminData?.image}
                            alt={adminData?.name}
                            className='w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white'
                        />
                        <h2 className='text-2xl font-bold'>{adminData?.name}</h2>
                        <p className='text-blue-100 mt-1'>🏢 Turf Owner</p>
                    </div>

                    {/* Profile Info */}
                    <div className='p-6 space-y-6'>
                        {isEditing ? (
                            /* Edit Mode */
                            <div className='space-y-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Full Name</label>
                                    <input
                                        type='text'
                                        name='name'
                                        value={formData.name}
                                        onChange={handleChange}
                                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                                    <input
                                        type='email'
                                        name='email'
                                        value={formData.email}
                                        onChange={handleChange}
                                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Phone</label>
                                    <input
                                        type='tel'
                                        name='phone'
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent'
                                    />
                                </div>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className='w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition'
                                >
                                    Save Changes
                                </button>
                            </div>
                        ) : (
                            /* View Mode */
                            <div className='space-y-4'>
                                <div className='bg-gray-50 rounded-lg p-4'>
                                    <p className='text-gray-600 text-sm font-medium'>📧 Email</p>
                                    <p className='text-gray-900 font-semibold mt-1'>{adminData?.email}</p>
                                </div>
                                <div className='bg-gray-50 rounded-lg p-4'>
                                    <p className='text-gray-600 text-sm font-medium'>📱 Phone</p>
                                    <p className='text-gray-900 font-semibold mt-1'>{adminData?.phone}</p>
                                </div>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className='w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition'
                                >
                                    Edit Profile
                                </button>
                            </div>
                        )}

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className='w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold mt-6'
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OwnerProfile
