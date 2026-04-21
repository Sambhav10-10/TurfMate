import React from 'react'

const StarRating = ({ rating, onRate, isInteractive = false, size = 'md' }) => {
    const [hoverRating, setHoverRating] = React.useState(0)

    const sizeClasses = {
        sm: 'text-lg',
        md: 'text-2xl',
        lg: 'text-4xl',
    }

    const displayRating = isInteractive ? (hoverRating || rating) : rating

    return (
        <div className='flex gap-1 items-center'>
            <div className='flex gap-0.5'>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        onClick={() => isInteractive && onRate && onRate(star)}
                        onMouseEnter={() => isInteractive && setHoverRating(star)}
                        onMouseLeave={() => isInteractive && setHoverRating(0)}
                        className={`${sizeClasses[size]} cursor-pointer transition-all ${star <= displayRating ? 'text-yellow-400' : 'text-gray-300'
                            } ${isInteractive ? 'hover:scale-110' : ''}`}
                    >
                        ★
                    </span>
                ))}
            </div>
            <span className='text-sm font-medium text-gray-600 ml-2'>
                {rating > 0 ? `${rating.toFixed(1)}/5` : 'No rating'}
            </span>
        </div>
    )
}

export default StarRating
