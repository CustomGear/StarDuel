'use client'

import { 
  StarIcon, 
  ChatBubbleLeftRightIcon, 
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'
import { getRatingColor, getSentimentColor } from '@/lib/utils'

interface DashboardStatsProps {
  data: {
    totalReviews: number
    totalMentions: number
    averageRating: number
    positiveSentiment: number
    negativeSentiment: number
    neutralSentiment: number
  }
}

export default function DashboardStats({ data }: DashboardStatsProps) {
  const stats = [
    {
      name: 'Total Reviews',
      value: data.totalReviews.toLocaleString(),
      icon: StarIcon,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      name: 'Staff Mentions',
      value: data.totalMentions.toLocaleString(),
      icon: ChatBubbleLeftRightIcon,
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      name: 'Average Rating',
      value: data.averageRating.toFixed(1),
      icon: ArrowTrendingUpIcon,
      change: '+0.2',
      changeType: 'positive' as const,
    },
    {
      name: 'Positive Sentiment',
      value: `${data.positiveSentiment}%`,
      icon: UserGroupIcon,
      change: '+5%',
      changeType: 'positive' as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.changeType === 'positive' ? (
                        <ArrowTrendingUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" aria-hidden="true" />
                      ) : (
                        <ArrowTrendingDownIcon className="self-center flex-shrink-0 h-4 w-4 text-red-500" aria-hidden="true" />
                      )}
                      <span className="sr-only">
                        {stat.changeType === 'positive' ? 'Increased' : 'Decreased'} by
                      </span>
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
