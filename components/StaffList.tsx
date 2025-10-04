'use client'

import { useState } from 'react'
import { formatDate, getInitials } from '@/lib/utils'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

interface Staff {
  id: string
  name: string
  email?: string | null
  position?: string | null
  department?: string | null
  createdAt: Date
  stats: {
    totalMentions: number
    positiveMentions: number
    negativeMentions: number
    averageRating: number
  }
}

interface StaffListProps {
  staff: Staff[]
}

export default function StaffList({ staff }: StaffListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      i < Math.round(rating) ? (
        <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
      ) : (
        <StarOutlineIcon key={i} className="h-4 w-4 text-gray-300" />
      )
    ))
  }

  const getSentimentPercentage = (positive: number, negative: number, total: number) => {
    if (total === 0) return { positive: 0, negative: 0 }
    return {
      positive: Math.round((positive / total) * 100),
      negative: Math.round((negative / total) * 100)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Staff Members ({staff.length})
        </h3>
        
        {staff.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No staff members added yet</p>
            <p className="text-sm text-gray-400">
              Add your team members to start tracking their mentions in reviews
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {staff.map((member) => {
              const sentiment = getSentimentPercentage(
                member.stats.positiveMentions,
                member.stats.negativeMentions,
                member.stats.totalMentions
              )

              return (
                <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-lg font-medium text-primary-600">
                            {getInitials(member.name)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-lg font-medium text-gray-900">
                            {member.name}
                          </h4>
                          {member.position && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {member.position}
                            </span>
                          )}
                          {member.department && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {member.department}
                            </span>
                          )}
                        </div>
                        
                        {member.email && (
                          <p className="text-sm text-gray-500 mt-1">
                            {member.email}
                          </p>
                        )}
                        
                        <p className="text-xs text-gray-400 mt-1">
                          Added {formatDate(member.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingId(member.id)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Performance Stats */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-900">
                        {member.stats.totalMentions}
                      </p>
                      <p className="text-sm text-gray-500">Total Mentions</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        {renderStars(member.stats.averageRating)}
                        <span className="text-sm text-gray-500 ml-1">
                          {member.stats.averageRating > 0 ? member.stats.averageRating.toFixed(1) : 'N/A'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Avg Rating</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-sm text-green-600">
                          {sentiment.positive}% positive
                        </span>
                        <span className="text-sm text-red-600">
                          {sentiment.negative}% negative
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Sentiment</p>
                    </div>
                  </div>
                  
                  {/* Progress Bars */}
                  {member.stats.totalMentions > 0 && (
                    <div className="mt-4">
                      <div className="flex space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${sentiment.positive}%` }}
                          />
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${sentiment.negative}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
