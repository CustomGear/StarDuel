'use client'

import { useState } from 'react'
import { formatDateTime, getSourceIcon, getRatingColor, getSentimentColor } from '@/lib/utils'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface Review {
  id: string
  title?: string | null
  content: string
  rating: number
  source: string
  authorName?: string | null
  sentiment?: string | null
  createdAt: Date
  staff?: {
    name: string
  } | null
  mentions: Array<{
    staff: {
      name: string
    }
  }>
}

interface ReviewsListProps {
  reviews: Review[]
}

export default function ReviewsList({ reviews }: ReviewsListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSource, setSelectedSource] = useState('')
  const [selectedSentiment, setSelectedSentiment] = useState('')

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      i < rating ? (
        <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
      ) : (
        <StarOutlineIcon key={i} className="h-4 w-4 text-gray-300" />
      )
    ))
  }

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.authorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.title?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSource = !selectedSource || review.source === selectedSource
    const matchesSentiment = !selectedSentiment || review.sentiment === selectedSentiment

    return matchesSearch && matchesSource && matchesSentiment
  })

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
            >
              <option value="">All Sources</option>
              <option value="GOOGLE">Google</option>
              <option value="YELP">Yelp</option>
              <option value="TRUSTPILOT">Trustpilot</option>
              <option value="FACEBOOK">Facebook</option>
              <option value="TRIPADVISOR">TripAdvisor</option>
              <option value="GLASSDOOR">Glassdoor</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
            >
              <option value="">All Sentiments</option>
              <option value="POSITIVE">Positive</option>
              <option value="NEUTRAL">Neutral</option>
              <option value="NEGATIVE">Negative</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            {filteredReviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {reviews.length === 0 ? 'No reviews found' : 'No reviews match your filters'}
              </p>
            ) : (
              filteredReviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-xl">{getSourceIcon(review.source)}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {review.authorName || 'Anonymous'}
                          </span>
                          <div className="flex items-center">
                            {renderStars(review.rating)}
                          </div>
                          <span className={`text-sm ${getRatingColor(review.rating)}`}>
                            {review.rating}/5
                          </span>
                        </div>
                        {review.sentiment && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSentimentColor(review.sentiment)}`}>
                            {review.sentiment}
                          </span>
                        )}
                      </div>
                      
                      {review.title && (
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {review.title}
                        </h3>
                      )}
                      
                      <p className="text-gray-700 mb-3">
                        {review.content}
                      </p>
                      
                      {review.mentions.length > 0 && (
                        <div className="bg-blue-50 p-3 rounded-md">
                          <p className="text-sm font-medium text-blue-900 mb-1">
                            Staff Mentions:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {review.mentions.map((mention, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {mention.staff.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4 text-right">
                      <p className="text-sm text-gray-500">
                        {formatDateTime(review.createdAt)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {review.source}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
