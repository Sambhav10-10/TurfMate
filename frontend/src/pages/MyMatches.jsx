import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import RatingModal from '../components/RatingModal'

const MyMatches = () => {
    const { backendUrl, token, userData, ratePlayer } = useContext(AppContext)

    const [created, setCreated] = useState([])
    const [joined, setJoined] = useState([])
    const [ratingModal, setRatingModal] = useState({ isOpen: false, playerId: '', playerName: '' })
    const [timers, setTimers] = useState({}) // Track countdown timers for each match
    const [cancelling, setCancelling] = useState(null) // Track which match is being cancelled

    // date formatting helper - handles both YYYY-MM-DD and DD_MM_YYYY formats
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formatDate = (dateStr) => {
        if (!dateStr) return 'Date not set'
        
        // Handle YYYY-MM-DD format (from backend)
        if (dateStr.includes('-')) {
            const [year, month, day] = dateStr.split('-')
            return `${day} ${months[Number(month) - 1]} ${year}`
        }
        
        // Handle DD_MM_YYYY format
        const [day, month, year] = dateStr.split('_')
        return `${day} ${months[Number(month) - 1]} ${year}`
    }

    // Format time helper (HH:MM to readable time)
    const formatTimeHHMM = (timeStr) => {
        return timeStr || 'Time not set'
    }

    const loadMatches = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/matches/user', { headers: { token } })
            if (data.success) {
                setCreated(data.created)
                setJoined(data.joined)

                // Initialize timers for joined matches that need payment
                const newTimers = {}
                data.joined.forEach(m => {
                    const paymentStatus = m.playerPaymentStatus?.find(p => p.userId === userData?._id)
                    if (paymentStatus && paymentStatus.reserved && !paymentStatus.confirmed) {
                        const reservedAt = new Date(paymentStatus.reservedAt)
                        const expiresAt = new Date(reservedAt.getTime() + 5 * 60 * 1000) // 5 minutes
                        const now = new Date()
                        const timeLeft = Math.max(0, Math.ceil((expiresAt - now) / 1000))
                        newTimers[m._id] = timeLeft
                    }
                })
                setTimers(newTimers)
            }
        } catch (error) {
            console.log(error)
            const errorMessage = error.response?.data?.message || error.message || 'Failed to load your matches. Please check your connection.'
            toast.error(errorMessage)
        }
    }

    // 5-minute countdown timer effect
    useEffect(() => {
        const interval = setInterval(() => {
            setTimers(prev => {
                const updated = { ...prev }
                Object.keys(updated).forEach(matchId => {
                    if (updated[matchId] > 0) {
                        updated[matchId] -= 1
                    } else {
                        delete updated[matchId] // Timer expired
                        toast.warning('⏰ Payment confirmation window expired. Please rejoin the match.')
                    }
                })
                return updated
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    // Format seconds to MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    // Cancel match with confirmation
    const leaveMatch = async (matchId) => {
        if (!userData) {
            toast.error('User data not loaded')
            return
        }

        const match = joined.find(m => m._id === matchId)
        if (!match) return

        // Calculate hours until match - handle both YYYY-MM-DD and DD_MM_YYYY formats
        let matchDateTime
        if (match.date.includes('-')) {
            const [year, month, day] = match.date.split('-').map(Number)
            matchDateTime = new Date(year, month - 1, day)
        } else {
            const [day, month, year] = match.date.split('_').map(Number)
            matchDateTime = new Date(year, month - 1, day)
        }
        const [hours, minutes] = match.time.split(':').map(Number)
        matchDateTime.setHours(hours, minutes)

        const now = new Date()
        const hoursUntilMatch = (matchDateTime - now) / (1000 * 60 * 60)

        // Show warning if cancelling too close to match
        if (hoursUntilMatch > 0 && hoursUntilMatch < 2) {
            if (!window.confirm(`⚠️ You are cancelling ${Math.round(hoursUntilMatch)}h before the match! A penalty will be applied. Continue?`)) {
                return
            }
        }

        setCancelling(matchId)
        try {
            const { data } = await axios.post(
                backendUrl + '/api/user/matches/leave',
                { userId: userData._id, matchId },
                { headers: { token } }
            )

            if (data.success) {
                if (data.penaltyApplied) {
                    toast.warning(`⚠️ ${data.message}`)
                } else {
                    toast.success(data.message)
                }
                loadMatches()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to cancel match'
            toast.error(errorMessage)
        } finally {
            setCancelling(null)
        }
    }

    // Confirm payment after payment is done
    const confirmPayment = async (matchId) => {
        if (!userData) {
            toast.error('User data not loaded')
            return
        }

        try {
            const { data } = await axios.post(
                backendUrl + '/api/user/matches/confirm-payment',
                { userId: userData._id, matchId },
                { headers: { token } }
            )

            if (data.success) {
                toast.success('✅ Payment confirmed! You are officially booked.')
                // Remove timer for this match
                setTimers(prev => {
                    const updated = { ...prev }
                    delete updated[matchId]
                    return updated
                })
                loadMatches()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to confirm payment'
            toast.error(errorMessage)
        }
    }

    const openRatingModal = (playerId, playerName) => {
        setRatingModal({ isOpen: true, playerId, playerName })
    }

    const handleRatePlayer = async (playerId, rating) => {
        return await ratePlayer(playerId, rating)
    }

    useEffect(() => {
        if (token) loadMatches()
    }, [token])

    return (
        <div className='min-h-screen bg-gray-100 p-4 md:p-6'>
            <RatingModal
                isOpen={ratingModal.isOpen}
                playerId={ratingModal.playerId}
                playerName={ratingModal.playerName}
                onRate={handleRatePlayer}
                onClose={() => setRatingModal({ isOpen: false, playerId: '', playerName: '' })}
            />

            {/* Matches I Created Section */}
            <div className='max-w-4xl mx-auto'>
                <h2 className='text-2xl font-bold mb-4 text-gray-800'>📋 Matches I Created</h2>
                {created.length === 0 ? (
                    <div className='bg-white rounded-lg p-6 text-center text-gray-600 shadow-sm'>
                        <p>No matches created yet.</p>
                    </div>
                ) : (
                    <div className='grid gap-4'>
                        {created.map((m) => (
                            <div key={m._id} className='bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition'>
                                <div className='flex justify-between items-start mb-3'>
                                    <div>
                                        <h3 className='text-lg font-semibold text-gray-800'>
                                            ⚽ {m.sportType}
                                        </h3>
                                        <p className='text-sm text-gray-600 mt-1'>
                                            📍 {m.location || 'Location not set'} {m.turfName ? `(${m.turfName})` : ''}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className='grid grid-cols-2 md:grid-cols-4 gap-3 text-sm'>
                                    <div className='bg-blue-50 p-2 rounded'>
                                        <p className='text-gray-600 text-xs'>Date & Time</p>
                                        <p className='font-semibold text-blue-700'>{formatDate(m.date)} @ {formatTimeHHMM(m.time)}</p>
                                    </div>
                                    <div className='bg-green-50 p-2 rounded'>
                                        <p className='text-gray-600 text-xs'>Slots</p>
                                        <p className='font-semibold text-green-700'>{m.joinedPlayers?.length || 0}/{m.totalSlots}</p>
                                    </div>
                                    <div className='bg-purple-50 p-2 rounded'>
                                        <p className='text-gray-600 text-xs'>Price/Head</p>
                                        <p className='font-semibold text-purple-700'>₹{m.pricePerHead}</p>
                                    </div>
                                    <div className='bg-orange-50 p-2 rounded'>
                                        <p className='text-gray-600 text-xs'>Status</p>
                                        <p className='font-semibold text-orange-700 capitalize'>{m.status || 'upcoming'}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Matches I Joined Section */}
            <div className='max-w-4xl mx-auto mt-10'>
                <h2 className='text-2xl font-bold mb-4 text-gray-800'>✅ Matches I Joined</h2>
                {joined.length === 0 ? (
                    <div className='bg-white rounded-lg p-6 text-center text-gray-600 shadow-sm'>
                        <p>No matches joined yet. Browse matches to join one!</p>
                    </div>
                ) : (
                    <div className='grid gap-4'>
                        {joined.map((m) => {
                            const paymentStatus = m.playerPaymentStatus?.find(p => p.userId === userData?._id)
                            const isPaymentPending = paymentStatus?.reserved && !paymentStatus?.confirmed
                            const timeRemaining = timers[m._id]

                            return (
                                <div key={m._id} className='bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden'>
                                    {/* Payment Status Banner */}
                                    {isPaymentPending && (
                                        <div className='bg-yellow-50 border-l-4 border-yellow-400 p-4'>
                                            <p className='text-sm font-semibold text-yellow-800 flex items-center gap-2'>
                                                <span>⏳</span>
                                                Payment confirmation required
                                            </p>
                                            <p className='text-lg font-bold text-yellow-700 mt-1 flex items-center gap-2'>
                                                <span>⏱️</span>
                                                {formatTime(timeRemaining || 0)} remaining
                                            </p>
                                            <button
                                                onClick={() => confirmPayment(m._id)}
                                                className='mt-3 px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition active:scale-95'
                                            >
                                                ✓ Confirm Payment
                                            </button>
                                        </div>
                                    )}
                                    {paymentStatus?.confirmed && (
                                        <div className='bg-green-50 border-l-4 border-green-400 p-4'>
                                            <p className='text-sm font-semibold text-green-700 flex items-center gap-2'>
                                                <span>✅</span>
                                                Payment Confirmed - You are officially booked!
                                            </p>
                                        </div>
                                    )}

                                    {/* Match Details */}
                                    <div className='p-5'>
                                        <div className='flex justify-between items-start mb-4'>
                                            <div className='flex-1'>
                                                <h3 className='text-lg font-semibold text-gray-800'>
                                                    ⚽ {m.sportType}
                                                </h3>
                                                <p className='text-sm text-gray-600 mt-1'>
                                                    📍 {m.location || 'Location not set'} {m.turfName ? `(${m.turfName})` : ''}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => leaveMatch(m._id)}
                                                disabled={cancelling === m._id}
                                                className='px-4 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 font-semibold rounded transition disabled:opacity-50 disabled:cursor-not-allowed'
                                            >
                                                {cancelling === m._id ? '⟳ Cancelling...' : '✕ Cancel'}
                                            </button>
                                        </div>

                                        <div className='grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4'>
                                            <div className='bg-blue-50 p-2 rounded'>
                                                <p className='text-gray-600 text-xs'>Date & Time</p>
                                                <p className='font-semibold text-blue-700'>{formatDate(m.date)} @ {formatTimeHHMM(m.time)}</p>
                                            </div>
                                            <div className='bg-green-50 p-2 rounded'>
                                                <p className='text-gray-600 text-xs'>Slots</p>
                                                <p className='font-semibold text-green-700'>{m.joinedPlayers?.length || 0}/{m.totalSlots}</p>
                                            </div>
                                            <div className='bg-purple-50 p-2 rounded'>
                                                <p className='text-gray-600 text-xs'>Price/Head</p>
                                                <p className='font-semibold text-purple-700'>₹{m.pricePerHead}</p>
                                            </div>
                                            <div className='bg-orange-50 p-2 rounded'>
                                                <p className='text-gray-600 text-xs'>Status</p>
                                                <p className='font-semibold text-orange-700 capitalize'>{m.status || 'upcoming'}</p>
                                            </div>
                                        </div>

                                        {/* Players Section */}
                                        <div className='pt-4 border-t'>
                                            <p className='text-sm font-semibold text-gray-700 mb-3'>👥 Other Players ({m.joinedPlayers?.length || 0})</p>
                                            {m.joinedPlayers?.length > 0 ? (
                                                <div className='flex flex-wrap gap-2'>
                                                    {m.joinedPlayers.map((playerId) => (
                                                        <button
                                                            key={playerId}
                                                            onClick={() => openRatingModal(playerId, `Player ${playerId.slice(-6)}`)}
                                                            className='text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-full transition font-medium'
                                                        >
                                                            ⭐ Rate Player
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className='text-xs text-gray-500 italic'>You are the only player in this match</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyMatches
