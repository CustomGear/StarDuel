'use client'

import { formatDateTime, getSourceIcon, getRatingColor, getSentimentColor } from '@/lib/utils'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'

interface Review {
  id: string
  title?: string | null
  content: string
  rating: number
  source: string
  authorName?: string | null
  sentiment?: string | null
  createdAt: Date
  mentions: Array<{
    staff: {
      name: string
    }
  }>
}

interface RecentReviewsProps {
  reviews: Review[]
}

export default function RecentReviews({ reviews }: RecentReviewsProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      i < rating ? (
        <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
      ) : (
        <StarOutlineIcon key={i} className="h-4 w-4 text-gray-300" />
      )
    ))
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Recent Reviews
        </h3>
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reviews yet</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{getSourceIcon(review.source)}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {review.authorName || 'Anonymous'}
                      </span>
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                      {review.sentiment && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSentimentColor(review.sentiment)}`}>
                          {review.sentiment}
                        </span>
                      )}
                    </div>
                    {review.title && (
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        {review.title}
                      </h4>
                    )}
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {review.content}
                    </p>
                    {review.mentions.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">
                          Mentions: {review.mentions.map(m => m.staff.name).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="ml-4 text-xs text-gray-500">
                    {formatDateTime(review.createdAt)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {reviews.length > 0 && (
          <div className="mt-4">
            <a
              href="/dashboard/reviews"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View all reviews →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
