import React from 'react'

export default function RatingStars({ rating, onRate }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <button key={i} onClick={() => onRate(i)} className={i <= rating ? 'text-yellow-500' : 'text-gray-300'} aria-label={`rate-${i}`}>
          ★
        </button>
      ))}
    </div>
  )
}
