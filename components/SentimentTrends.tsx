'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'

interface SentimentTrendsProps {
  trends: Array<{
    date: string
    reviews: number
    averageRating: number
    positive: number
    negative: number
    neutral: number
  }>
}

export default function SentimentTrends({ trends }: SentimentTrendsProps) {
  const chartData = trends.map(trend => ({
    ...trend,
    date: format(new Date(trend.date), 'MMM dd'),
    positivePercent: trend.reviews > 0 ? Math.round((trend.positive / trend.reviews) * 100) : 0,
    negativePercent: trend.reviews > 0 ? Math.round((trend.negative / trend.reviews) * 100) : 0
  }))

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Sentiment Trends
        </h3>
        
        {chartData.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No trend data available</p>
        ) : (
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="positivePercent" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Positive %"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="negativePercent" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Negative %"
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-semibold text-green-600">
                  {chartData.reduce((sum, day) => sum + day.positive, 0)}
                </p>
                <p className="text-sm text-gray-500">Positive Reviews</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-600">
                  {chartData.reduce((sum, day) => sum + day.neutral, 0)}
                </p>
                <p className="text-sm text-gray-500">Neutral Reviews</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-red-600">
                  {chartData.reduce((sum, day) => sum + day.negative, 0)}
                </p>
                <p className="text-sm text-gray-500">Negative Reviews</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
