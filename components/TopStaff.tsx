'use client'

import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import { getInitials } from '@/lib/utils'

interface Staff {
  id: string
  name: string
  position?: string | null
  department?: string | null
}

interface TopStaffProps {
  staff: Array<{
    staff: Staff
    mentionCount: number
    averageRating: number
  }>
}

export default function TopStaff({ staff }: TopStaffProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      i < Math.round(rating) ? (
        <StarIcon key={i} className="h-3 w-3 text-yellow-400" />
      ) : (
        <StarOutlineIcon key={i} className="h-3 w-3 text-gray-300" />
      )
    ))
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Top Staff by Mentions
        </h3>
        <div className="space-y-4">
          {staff.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No staff mentions yet</p>
          ) : (
            staff.map((item, index) => (
              <div key={item.staff.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-600">
                      {getInitials(item.staff.name)}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.staff.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {item.staff.position} {item.staff.department && `• ${item.staff.department}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {item.mentionCount} mentions
                      </p>
                      {item.averageRating > 0 && (
                        <div className="flex items-center justify-end space-x-1">
                          {renderStars(item.averageRating)}
                          <span className="text-xs text-gray-500 ml-1">
                            {item.averageRating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {staff.length > 0 && (
          <div className="mt-4">
            <a
              href="/dashboard/staff"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View all staff →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
