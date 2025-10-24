import { Star } from 'lucide-react'

interface SingleStarRatingProps {
  rating: number // Rating between 0 and 5
}

export const SingleStarRating: React.FC<SingleStarRatingProps> = ({
  rating,
}) => {
  // Ensure rating is between 0 and 5
  const clampedRating = Math.max(0, Math.min(5, rating))
  // Calculate fill percentage (0% to 100%)
  const fillPercentage = (clampedRating / 5) * 100

  return (
    <div dir="ltr" className="relative inline-block w-6 h-6">
      {/* Background empty star */}
      <Star className="w-6 h-6 text-gray-300" fill="none" />
      {/* Filled star with dynamic width */}
      <div
        className="absolute top-0 left-0 overflow-hidden"
        style={{ width: `${fillPercentage}%` }}
      >
        <Star className="w-6 h-6 text-green-500" fill="currentColor" />
      </div>
    </div>
  )
}
