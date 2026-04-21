import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import StarRating from '../components/StarRating'
import RatingModal from '../components/RatingModal'

const PlayerProfile = () => {
    const { playerId } = useParams()
    const navigate = useNavigate()
    const { backendUrl, token, ratePlayer } = useContext(AppContext)

    const [player, setPlayer] = useState(null)
    const [loading, setLoading] = useState(true)
    const [ratingModal, setRatingModal] = useState(false)

    useEffect(() => {
        const fetchPlayerProfile = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/user/profile/${playerId}`, { headers: { token } })
                if (data.success) {
                    setPlayer(data.userData)
                } else {
                    toast.error(data.message)
                    navigate(-1)
                }
            } catch (error) {
                console.log(error)
                const errorMessage = error.response?.data?.message || 'Failed to load player profile'
                toast.error(errorMessage)
                navigate(-1)
            } finally {
                setLoading(false)
            }
        }

        if (token && playerId) {
            fetchPlayerProfile()
        }
    }, [playerId, token, backendUrl, navigate])

    const handleRatePlayer = async (pId, rating) => {
        const success = await ratePlayer(pId, rating)
        if (success) {
            // Refresh player data
            try {
                const { data } = await axios.get(`${backendUrl}/api/user/profile/${playerId}`, { headers: { token } })
                if (data.success) {
                    setPlayer(data.userData)
                }
                setRatingModal(false)
            } catch (error) {
                console.log(error)
                const errorMessage = error.response?.data?.message || error.message || 'Failed to refresh player data'
                toast.error(errorMessage)
            }
        }
        return success
    }

    if (loading) return <div className='flex justify-center items-center h-64'>Loading...</div>
    if (!player) return null

    return (
        <div className='max-w-2xl mx-auto p-4'>
            <button
                onClick={() => navigate(-1)}
                className='mb-4 text-blue-600 hover:underline'
            >
                ← Back
            </button>

            <div className='bg-white rounded-lg p-6 shadow-md'>
                <div className='flex gap-6 mb-6'>
                    <img
                        src={player.image}
                        alt={player.name}
                        className='w-24 h-24 rounded-full object-cover'
                    />
                    <div className='flex-1'>
                        <h1 className='text-3xl font-bold mb-2'>{player.name}</h1>
                        <div className='mb-4'>
                            <p className='text-gray-600 mb-2'>Player Rating</p>
                            <StarRating rating={player.averageRating || 0} size='lg' />
                            <p className='text-sm text-gray-500 mt-1'>
                                {player.totalRatings || 0} rating{player.totalRatings !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <button
                            onClick={() => setRatingModal(true)}
                            className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
                        >
                            Rate This Player
                        </button>
                    </div>
                </div>

                <hr className='my-6' />

                <div className='grid grid-cols-2 gap-6'>
                    <div>
                        <h3 className='font-semibold mb-3'>Contact Information</h3>
                        <p className='text-gray-600 mb-2'>
                            <span className='font-medium'>Email:</span> {player.email}
                        </p>
                        <p className='text-gray-600'>
                            <span className='font-medium'>Phone:</span> {player.phone}
                        </p>
                    </div>

                    <div>
                        <h3 className='font-semibold mb-3'>Personal Details</h3>
                        <p className='text-gray-600 mb-2'>
                            <span className='font-medium'>Gender:</span> {player.gender}
                        </p>
                        <p className='text-gray-600'>
                            <span className='font-medium'>DOB:</span> {player.dob}
                        </p>
                    </div>
                </div>

                {player.address && (player.address.line1 || player.address.line2) && (
                    <>
                        <hr className='my-6' />
                        <div>
                            <h3 className='font-semibold mb-3'>Address</h3>
                            <p className='text-gray-600'>
                                {player.address.line1} {player.address.line2 && `, ${player.address.line2}`}
                            </p>
                        </div>
                    </>
                )}
            </div>

            <RatingModal
                isOpen={ratingModal}
                playerId={playerId}
                playerName={player.name}
                onRate={handleRatePlayer}
                onClose={() => setRatingModal(false)}
            />
        </div>
    )
}

export default PlayerProfile
