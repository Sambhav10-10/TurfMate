import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Matches = () => {
  const { backendUrl, token, userData } = useContext(AppContext)
  const [matches, setMatches] = useState([])
  const [filter, setFilter] = useState('all')

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

  const loadMatches = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/matches', { headers: { token } })
      if (data.success) {
        setMatches(data.matches)
      }
    } catch (error) {
      console.log(error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load matches. Please check your connection.'
      toast.error(errorMessage)
    }
  }

  const join = async (matchId) => {
    try {
      const userId = userData?._id
      const { data } = await axios.post(backendUrl + '/api/user/matches/join', { matchId, userId }, { headers: { token } })
      if (data.success) {
        toast.success('✅ Slot reserved! Confirm payment within 5 minutes.')
        loadMatches()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to join match. Please try again.'
      toast.error(errorMessage)
    }
  }

  const filteredMatches = matches.filter(m => {
    if (filter === 'football') return m.sportType === 'football'
    if (filter === 'cricket') return m.sportType === 'cricket'
    return true
  })

  useEffect(() => {
    if (token) loadMatches()
  }, [token])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8'>
      {/* Header */}
      <div className='max-w-6xl mx-auto mb-8'>
        <div className='flex justify-between items-start mb-6'>
          <div>
            <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-2'>⚽ Available Matches</h1>
            <p className='text-gray-600'>Find and join exciting matches near you</p>
          </div>
          <div className='text-right'>
            <p className='text-sm text-gray-600'>Total Matches</p>
            <p className='text-2xl font-bold text-blue-600'>{matches.length}</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className='flex gap-2'>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-600'}`}
          >
            All Sports
          </button>
          <button
            onClick={() => setFilter('football')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'football' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-600'}`}
          >
            ⚽ Football
          </button>
          <button
            onClick={() => setFilter('cricket')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'cricket' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-600'}`}
          >
            🏏 Cricket
          </button>
        </div>
      </div>

      {/* Matches Grid */}
      <div className='max-w-6xl mx-auto'>
        {filteredMatches.length === 0 ? (
          <div className='bg-white rounded-xl shadow-md p-12 text-center'>
            <p className='text-2xl text-gray-400 mb-2'>😔 No matches found</p>
            <p className='text-gray-600'>Check back later for new matches!</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {filteredMatches.map(m => (
              <div key={m._id} className='bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 overflow-hidden'>
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
                    <p className='text-lg font-bold text-gray-800'>📍 {m.location || 'Not specified'}</p>
                    {m.turfName && <p className='text-sm text-gray-600'>@ {m.turfName}</p>}
                  </div>

                  {/* Date & Time */}
                  <div className='grid grid-cols-2 gap-4 mb-4'>
                    <div className='bg-blue-50 p-3 rounded-lg'>
                      <p className='text-xs text-gray-600 font-semibold'>📅 Date</p>
                      <p className='text-sm font-bold text-blue-700'>{formatDate(m.date)}</p>
                    </div>
                    <div className='bg-green-50 p-3 rounded-lg'>
                      <p className='text-xs text-gray-600 font-semibold'>⏰ Time</p>
                      <p className='text-sm font-bold text-green-700'>{m.time}</p>
                    </div>
                  </div>

                  {/* Slots and Price */}
                  <div className='grid grid-cols-2 gap-4 mb-4'>
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
                      <p className='text-xs text-gray-600 font-semibold'>💰 Price</p>
                      <p className='text-sm font-bold text-orange-700'>₹{m.pricePerHead}/head</p>
                    </div>
                  </div>

                  {/* Skill Level */}
                  <div className='mb-4 bg-gray-50 p-3 rounded-lg'>
                    <p className='text-xs text-gray-600 font-semibold'>🎯 Skill Level</p>
                    <p className='text-sm font-bold text-gray-700'>{m.skillLevel || 'Beginner'}</p>
                  </div>

                  {/* Join Button */}
                  <button
                    disabled={m.isFull || m.joinedPlayers.includes(userData?._id)}
                    onClick={() => join(m._id)}
                    className={`w-full py-3 px-4 rounded-lg font-bold text-white transition transform active:scale-95 ${m.isFull
                        ? 'bg-gray-400 cursor-not-allowed'
                        : m.joinedPlayers.includes(userData?._id)
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                      }`}
                  >
                    {m.isFull ? '🚫 Full' : m.joinedPlayers.includes(userData?._id) ? '✅ Joined' : '⚡ Join Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Matches