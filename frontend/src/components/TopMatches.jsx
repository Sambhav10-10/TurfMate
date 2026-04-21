import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopMatches = () => {
    const navigate = useNavigate()
    const { matches } = useContext(AppContext)

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Date not set'
        try {
            let day, month, year
            if (dateStr.includes('_')) {
                [day, month, year] = dateStr.split('_')
            } else if (dateStr.includes('-')) {
                [year, month, day] = dateStr.split('-')
            } else {
                return dateStr
            }
            return `${day} ${months[Number(month) - 1]} ${year}`
        } catch (e) {
            return dateStr
        }
    }

    const getSportIcon = (sport) => {
        return sport?.toLowerCase() === 'cricket' ? '🏏' : '⚽'
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'upcoming': return 'bg-blue-100 text-blue-700'
            case 'ongoing': return 'bg-green-100 text-green-700'
            case 'completed': return 'bg-gray-100 text-gray-700'
            case 'cancelled': return 'bg-red-100 text-red-700'
            default: return 'bg-blue-100 text-blue-700'
        }
    }

    return (
        <div className='bg-gradient-to-br from-gray-50 to-gray-100 py-16'>
            <div className='max-w-6xl mx-auto px-4 md:px-8'>
                {/* Header */}
                <div className='text-center mb-12'>
                    <h1 className='text-4xl font-semibold text-gray-800 mb-3'>Upcoming Matches</h1>
                    <p className='text-gray-600 text-lg max-w-2xl mx-auto'>Browse ongoing turf matches and join the fun. Find the perfect match for you!</p>
                </div>

                {/* Matches Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10'>
                    {matches.slice(0, 10).map((m, index) => (
                        <div key={index} className='bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 overflow-hidden'>
                            {/* Header with Sport and Status */}
                            <div className='bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white'>
                                <div className='flex justify-between items-start'>
                                    <div>
                                        <p className='text-3xl'>{getSportIcon(m.sportType)}</p>
                                        <p className='text-sm font-semibold mt-2 capitalize'>{m.sportType}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusColor(m.status || 'upcoming')}`}>
                                        {m.status || 'upcoming'}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className='p-5'>
                                {/* Location */}
                                <div className='mb-4'>
                                    <p className='text-xs text-gray-500 uppercase font-semibold'>Location</p>
                                    <p className='text-lg font-bold text-gray-800'>{m.location || 'Not specified'}</p>
                                    {m.turfName && <p className='text-sm text-gray-600'>@ {m.turfName}</p>}
                                </div>

                                {/* Date & Time */}
                                <div className='grid grid-cols-2 gap-3 mb-4'>
                                    <div className='bg-blue-50 p-3 rounded-lg'>
                                        <p className='text-xs text-gray-600 font-semibold'>Date</p>
                                        <p className='text-sm font-bold text-blue-700'>{formatDate(m.date)}</p>
                                    </div>
                                    <div className='bg-green-50 p-3 rounded-lg'>
                                        <p className='text-xs text-gray-600 font-semibold'>⏰ Time</p>
                                        <p className='text-sm font-bold text-green-700'>{m.time}</p>
                                    </div>
                                </div>

                                {/* Slots and Price */}
                                <div className='grid grid-cols-2 gap-3 mb-4'>
                                    <div className='bg-purple-50 p-3 rounded-lg'>
                                        <p className='text-xs text-gray-600 font-semibold'>👥 Slots</p>
                                        <p className='text-sm font-bold text-purple-700'>{m.joinedPlayers?.length || 0}/{m.totalSlots}</p>
                                        <div className='w-full bg-gray-200 rounded-full h-2 mt-2'>
                                            <div
                                                className='bg-purple-600 h-2 rounded-full transition-all'
                                                style={{ width: `${((m.joinedPlayers?.length || 0) / m.totalSlots) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className='bg-orange-50 p-3 rounded-lg'>
                                        <p className='text-xs text-gray-600 font-semibold'>Price</p>
                                        <p className='text-sm font-bold text-orange-700'>₹{m.pricePerHead}/head</p>
                                    </div>
                                </div>

                                {/* Skill Level */}
                                <div className='mb-4 bg-gray-50 p-3 rounded-lg'>
                                    <p className='text-xs text-gray-600 font-semibold'>🎯 Skill Level</p>
                                    <p className='text-sm font-bold text-gray-700'>{m.skillLevel || 'Beginner'}</p>
                                </div>

                                {/* View Details Button */}
                                <button
                                    onClick={() => { navigate('/matches'); scrollTo(0, 0) }}
                                    className='w-full py-3 px-4 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition transform active:scale-95'
                                >
                                    👁️ View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className='flex justify-center'>
                    <button
                        onClick={() => { navigate('/matches'); scrollTo(0, 0) }}
                        className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition transform hover:scale-105'
                    >
                        View All Matches →
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TopMatches