'use client'

import { formatDate, getSourceIcon, getRatingColor, getSentimentColor } from '@/lib/utils'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import { getInitials } from '@/lib/utils'

interface ReportsListProps {
  data: {
    totalReviews: number
    totalMentions: number
    averageRating: number
    sentimentDistribution: Record<string, number>
    sourceDistribution: Record<string, number>
    staffPerformance: Array<{
      staff: {
        id: string
        name: string
        position?: string | null
      }
      totalMentions: number
      positiveMentions: number
      negativeMentions: number
      averageRating: number
      sentimentScore: number
    }>
    recentReviews: Array<{
      id: string
      title?: string | null
      content: string
      rating: number
      source: string
      authorName?: string | null
      sentiment?: string | null
      createdAt: Date
    }>
    topPerformingStaff: Array<{
      staff: {
        id: string
        name: string
        position?: string | null
      }
      totalMentions: number
      positiveMentions: number
      averageRating: number
      sentimentScore: number
    }>
  }
}

export default function ReportsList({ data }: ReportsListProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      i < rating ? (
        <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
      ) : (
        <StarOutlineIcon key={i} className="h-4 w-4 text-gray-300" />
      )
    ))
  }

  const totalSentiment = Object.values(data.sentimentDistribution).reduce((sum, count) => sum + count, 0)
  const sentimentPercentages = {
    positive: totalSentiment > 0 ? Math.round((data.sentimentDistribution.POSITIVE || 0) / totalSentiment * 100) : 0,
    neutral: totalSentiment > 0 ? Math.round((data.sentimentDistribution.NEUTRAL || 0) / totalSentiment * 100) : 0,
    negative: totalSentiment > 0 ? Math.round((data.sentimentDistribution.NEGATIVE || 0) / totalSentiment * 100) : 0
  }

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Executive Summary
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{data.totalReviews}</p>
              <p className="text-sm text-blue-800">Total Reviews</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{data.totalMentions}</p>
              <p className="text-sm text-green-800">Staff Mentions</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{data.averageRating.toFixed(1)}</p>
              <p className="text-sm text-yellow-800">Average Rating</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{sentimentPercentages.positive}%</p>
              <p className="text-sm text-purple-800">Positive Sentiment</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-2">Sentiment Distribution</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Positive</span>
                  <span className="text-sm font-medium text-green-600">{sentimentPercentages.positive}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${sentimentPercentages.positive}%` }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Neutral</span>
                  <span className="text-sm font-medium text-gray-600">{sentimentPercentages.neutral}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-500 h-2 rounded-full" style={{ width: `${sentimentPercentages.neutral}%` }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Negative</span>
                  <span className="text-sm font-medium text-red-600">{sentimentPercentages.negative}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: `${sentimentPercentages.negative}%` }}></div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-900 mb-2">Review Sources</h4>
              <div className="space-y-2">
                {Object.entries(data.sourceDistribution).map(([source, count]) => (
                  <div key={source} className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span>{getSourceIcon(source)}</span>
                      <span className="text-sm text-gray-600">{source}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Staff */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Top Performing Staff
          </h3>
          
          <div className="space-y-4">
            {data.topPerformingStaff.map((member, index) => (
              <div key={member.staff.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-lg font-medium text-primary-600">
                        {getInitials(member.staff.name)}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900">
                        {member.staff.name}
                      </h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        #{index + 1}
                      </span>
                    </div>
                    {member.staff.position && (
                      <p className="text-sm text-gray-500">
                        {member.staff.position}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    {renderStars(member.averageRating)}
                    <span className="text-sm text-gray-500 ml-1">
                      {member.averageRating > 0 ? member.averageRating.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {member.totalMentions} mentions
                  </p>
                  <p className="text-sm text-green-600">
                    {member.sentimentScore}% positive
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent Reviews
          </h3>
          
          <div className="space-y-4">
            {data.recentReviews.map((review) => (
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
                  </div>
                  
                  <div className="ml-4 text-xs text-gray-500">
                    {formatDate(review.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
