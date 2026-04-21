import React, { useState } from 'react'
import StarRating from './StarRating'

const RatingModal = ({ isOpen, playerName, playerId, onRate, onClose }) => {
    const [rating, setRating] = useState(0)

    const handleSubmit = async () => {
        if (rating === 0) {
            alert('Please select a rating')
            return
        }
        const success = await onRate(playerId, rating)
        if (success) {
            setRating(0)
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-lg'>
                <h2 className='text-xl font-semibold mb-4'>Rate {playerName}</h2>

                <div className='mb-6 flex justify-center'>
                    <StarRating
                        rating={rating}
                        onRate={setRating}
                        isInteractive={true}
                        size='lg'
                    />
                </div>

                <div className='flex gap-3'>
                    <button
                        onClick={onClose}
                        className='flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className='flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700'
                    >
                        Submit Rating
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RatingModal
