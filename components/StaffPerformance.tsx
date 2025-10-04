'use client'

import { getInitials } from '@/lib/utils'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline'

interface StaffPerformanceProps {
  staff: Array<{
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
}

export default function StaffPerformance({ staff }: StaffPerformanceProps) {
  const topStaff = staff.slice(0, 5)

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Staff Performance
        </h3>
        
        {topStaff.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No staff performance data available</p>
        ) : (
          <div className="space-y-4">
            {topStaff.map((member, index) => {
              const sentimentTrend = member.positiveMentions > member.negativeMentions ? 'up' : 'down'
              const sentimentColor = member.sentimentScore >= 70 ? 'text-green-600' : 
                                   member.sentimentScore >= 50 ? 'text-yellow-600' : 'text-red-600'

              return (
                <div key={member.staff.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">
                          {getInitials(member.staff.name)}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {member.staff.name}
                      </p>
                      {member.staff.position && (
                        <p className="text-xs text-gray-500">
                          {member.staff.position}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {member.totalMentions} mentions
                      </p>
                      <p className="text-xs text-gray-500">
                        {member.averageRating > 0 ? `${member.averageRating.toFixed(1)} avg rating` : 'No ratings'}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        {sentimentTrend === 'up' ? (
                          <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${sentimentColor}`}>
                          {member.sentimentScore}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {member.positiveMentions} positive
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        {staff.length > 5 && (
          <div className="mt-4 text-center">
            <button className="text-sm text-primary-600 hover:text-primary-500">
              View all staff performance →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
