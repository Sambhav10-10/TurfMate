import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import StarRating from '../components/StarRating'

const MyProfile = () => {

    const [isEdit, setIsEdit] = useState(false)

    const [image, setImage] = useState(false)

    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)

    // Function to update user profile data using API
    const updateUserProfileData = async () => {

        try {

            const formData = new FormData();

            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('address', JSON.stringify(userData.address))
            formData.append('gender', userData.gender)
            formData.append('dob', userData.dob)

            image && formData.append('image', image)

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                await loadUserProfileData()
                setIsEdit(false)
                setImage(false)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile. Please check your connection and try again.'
            toast.error(errorMessage)
        }

    }

    return userData ? (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4'>
            <div className='max-w-4xl mx-auto'>
                {/* Page Header */}
                <div className='flex items-center gap-3 mb-8'>
                    <span className='text-4xl'>👤</span>
                    <div>
                        <h1 className='text-3xl font-bold text-gray-800'>My Profile</h1>
                        <p className='text-gray-600 text-sm'>Manage your personal information and preferences</p>
                    </div>
                </div>

                {/* Profile Card */}
                <div className='bg-white rounded-xl shadow-lg overflow-hidden mb-8'>
                    {/* Profile Header Section */}
                    <div className='bg-gradient-to-r from-blue-600 to-blue-700 p-8'>
                        <div className='flex flex-col md:flex-row gap-8 items-start md:items-center'>
                            {/* Profile Image */}
                            <div>
                                {isEdit
                                    ? <label htmlFor='image' className='block'>
                                        <div className='inline-block relative cursor-pointer'>
                                            <img
                                                className='w-40 h-40 rounded-xl shadow-lg object-cover opacity-80 hover:opacity-100 transition'
                                                src={image ? URL.createObjectURL(image) : userData.image}
                                                alt="Profile"
                                            />
                                            <div className='absolute inset-0 flex items-center justify-center rounded-xl bg-black bg-opacity-30'>
                                                <img className='w-12' src={assets.upload_icon} alt="Upload" />
                                            </div>
                                        </div>
                                        <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                                    </label>
                                    : <img className='w-40 h-40 rounded-xl shadow-lg object-cover' src={userData.image} alt="Profile" />
                                }
                            </div>

                            {/* Name & Rating */}
                            <div className='text-white flex-1'>
                                {isEdit
                                    ? <input
                                        className='text-4xl font-bold bg-blue-500 bg-opacity-50 text-white px-4 py-2 rounded-lg max-w-lg w-full mb-4'
                                        type="text"
                                        onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                                        value={userData.name}
                                    />
                                    : <h2 className='text-4xl font-bold mb-4'>{userData.name}</h2>
                                }

                                {/* Rating Display */}
                                <div className='bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-lg'>
                                    <p className='text-yellow-300 text-sm font-semibold mb-3'>⭐ Player Rating</p>
                                    <StarRating
                                        rating={userData.averageRating || 0}
                                        size='md'
                                    />
                                    <p className='mt-3 text-yellow-100 text-sm font-semibold'>{userData.totalRatings || 0} rating{userData.totalRatings !== 1 ? 's' : ''}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className='p-8 border-b'>
                        <div className='flex items-center gap-3 mb-6'>
                            <span className='text-2xl'>📧</span>
                            <h3 className='text-xl font-bold text-gray-800'>Contact Information</h3>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            {/* Email */}
                            <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
                                <p className='text-xs font-semibold text-gray-600 uppercase mb-2'>Email</p>
                                <p className='text-lg font-semibold text-blue-600'>{userData.email}</p>
                            </div>

                            {/* Phone */}
                            <div className='bg-green-50 p-4 rounded-lg border border-green-200'>
                                <p className='text-xs font-semibold text-gray-600 uppercase mb-2'>📱 Phone</p>
                                {isEdit
                                    ? <input
                                        className='w-full border-2 border-green-300 rounded-lg p-2 focus:border-green-600 focus:outline-none'
                                        type="text"
                                        onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                                        value={userData.phone}
                                    />
                                    : <p className='text-lg font-semibold text-green-600'>{userData.phone}</p>
                                }
                            </div>

                            {/* Address */}
                            <div className='bg-purple-50 p-4 rounded-lg border border-purple-200 md:col-span-2'>
                                <p className='text-xs font-semibold text-gray-600 uppercase mb-3'>📍 Address</p>
                                {isEdit
                                    ? <div className='space-y-2'>
                                        <input
                                            className='w-full border-2 border-purple-300 rounded-lg p-2 focus:border-purple-600 focus:outline-none'
                                            type="text"
                                            placeholder='Address Line 1'
                                            onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                                            value={userData.address.line1}
                                        />
                                        <input
                                            className='w-full border-2 border-purple-300 rounded-lg p-2 focus:border-purple-600 focus:outline-none'
                                            type="text"
                                            placeholder='Address Line 2'
                                            onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                                            value={userData.address.line2}
                                        />
                                    </div>
                                    : <p className='text-lg text-purple-600 font-semibold'>{userData.address.line1} <br /> {userData.address.line2}</p>
                                }
                            </div>
                        </div>
                    </div>

                    {/* Basic Information Section */}
                    <div className='p-8'>
                        <div className='flex items-center gap-3 mb-6'>
                            <span className='text-2xl'>ℹ️</span>
                            <h3 className='text-xl font-bold text-gray-800'>Basic Information</h3>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            {/* Gender */}
                            <div className='bg-orange-50 p-4 rounded-lg border border-orange-200'>
                                <p className='text-xs font-semibold text-gray-600 uppercase mb-2'>👥 Gender</p>
                                {isEdit
                                    ? <select
                                        className='w-full border-2 border-orange-300 rounded-lg p-2 focus:border-orange-600 focus:outline-none'
                                        onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                                        value={userData.gender}
                                    >
                                        <option value="Not Selected">Not Selected</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    : <p className='text-lg font-semibold text-orange-600'>{userData.gender}</p>
                                }
                            </div>

                            {/* Birthday */}
                            <div className='bg-pink-50 p-4 rounded-lg border border-pink-200'>
                                <p className='text-xs font-semibold text-gray-600 uppercase mb-2'>🎂 Birthday</p>
                                {isEdit
                                    ? <input
                                        className='w-full border-2 border-pink-300 rounded-lg p-2 focus:border-pink-600 focus:outline-none'
                                        type='date'
                                        onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                                        value={userData.dob}
                                    />
                                    : <p className='text-lg font-semibold text-pink-600'>{userData.dob}</p>
                                }
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='bg-gray-50 px-8 py-6 border-t flex gap-4'>
                        {isEdit
                            ? <button
                                onClick={updateUserProfileData}
                                className='bg-gradient-to-r from-green-600 to-green-700 text-white font-bold px-8 py-3 rounded-lg hover:shadow-lg transition transform hover:scale-105 active:scale-95'
                            >
                                ✅ Save Information
                            </button>
                            : <button
                                onClick={() => setIsEdit(true)}
                                className='bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold px-8 py-3 rounded-lg hover:shadow-lg transition transform hover:scale-105 active:scale-95'
                            >
                                ✏️ Edit Profile
                            </button>
                        }
                        {isEdit && (
                            <button
                                onClick={() => { setIsEdit(false); setImage(false) }}
                                className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold px-8 py-3 rounded-lg transition'
                            >
                                ❌ Cancel
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    ) : null
}

export default MyProfile