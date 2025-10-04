'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { format } from 'date-fns'

interface ReviewTrendsProps {
  trends: Array<{
    rating: number
    sentiment: string | null
    createdAt: Date
  }>
}

export default function ReviewTrends({ trends }: ReviewTrendsProps) {
  // Group trends by date
  const trendsByDate = trends.reduce((acc, trend) => {
    const date = format(new Date(trend.createdAt), 'MMM dd')
    if (!acc[date]) {
      acc[date] = { date, reviews: 0, averageRating: 0, positive: 0, negative: 0, neutral: 0 }
    }
    acc[date].reviews += 1
    acc[date].averageRating += trend.rating
    
    if (trend.sentiment === 'POSITIVE') acc[date].positive += 1
    else if (trend.sentiment === 'NEGATIVE') acc[date].negative += 1
    else acc[date].neutral += 1
    
    return acc
  }, {} as Record<string, any>)

  // Calculate average ratings
  Object.values(trendsByDate).forEach((day: any) => {
    day.averageRating = day.reviews > 0 ? (day.averageRating / day.reviews).toFixed(1) : 0
  })

  const chartData = Object.values(trendsByDate).slice(-7) // Last 7 days

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Review Trends (Last 7 Days)
        </h3>
        
        {chartData.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No review data available</p>
        ) : (
          <div className="space-y-6">
            {/* Reviews Count Chart */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Reviews per Day</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="reviews" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Average Rating Chart */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Average Rating</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="averageRating" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Sentiment Distribution */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Sentiment Distribution</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="positive" stackId="a" fill="#10b981" name="Positive" />
                  <Bar dataKey="neutral" stackId="a" fill="#6b7280" name="Neutral" />
                  <Bar dataKey="negative" stackId="a" fill="#ef4444" name="Negative" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
